"use server";
import { headers } from "next/headers";
import { reservationSchema, type FormState } from "@/lib/reservation-schema";
import { notifyRestaurant } from "@/lib/notify";
import { getSiteContent, insertBooking } from "@/lib/content/store";
import { hasDatabase } from "@/lib/db";
import { checkBookingTime } from "@/lib/content/hours";

// Best-effort in-memory rate limit (Render runs one instance, so this holds).
const hits = new Map<string, { count: number; reset: number }>();
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

function rateLimited(key: string) {
  const now = Date.now();
  for (const [k, v] of hits) if (v.reset < now) hits.delete(k); // keep memory bounded
  const entry = hits.get(key);
  if (!entry) {
    hits.set(key, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > LIMIT;
}

/** Days between today (India time) and an ISO date. */
function daysFromToday(iso: string) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
  return Math.round((Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000);
}

export async function reserve(_prev: FormState, formData: FormData): Promise<FormState> {
  // Honeypot: real users never see or fill this field.
  if (formData.get("company")) return { status: "success", message: "Thanks! We'll call you shortly to confirm." };

  const raw = Object.fromEntries(
    ["name", "phone", "date", "time", "guests", "notes", "consent"].map((k) => [k, formData.get(k)?.toString() ?? undefined]),
  );
  const { consent: _consent, ...values } = raw as Record<string, string | undefined>;

  // IP is used ONLY transiently for rate-limiting and never stored or forwarded.
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return { status: "error", message: "Too many requests. Please try again later or call us.", values };
  }

  const { settings } = await getSiteContent();
  const rules = settings.booking;
  if (!rules.enabled) {
    return { status: "error", message: "Online booking is paused right now. Please call us to reserve.", values };
  }

  const parsed = reservationSchema.safeParse(raw);
  const errors: FormState["errors"] = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<FormState["errors"]>;
      if (key && !errors[key]) errors[key] = issue.message;
    }
  } else {
    const d = parsed.data;
    const ahead = daysFromToday(d.date);
    if (ahead < 0 || ahead > rules.maxDaysAhead) errors.date = `Choose a date between today and ${rules.maxDaysAhead} days from now.`;
    else {
      const timeError = checkBookingTime(settings.hours.days, d.date, d.time, rules.lastSeatingMinutes);
      if (timeError) errors.time = timeError;
    }
    if (d.guests > rules.maxGuests) errors.guests = `For more than ${rules.maxGuests} guests, please call us.`;
  }
  if (!parsed.success || Object.keys(errors).length) {
    return { status: "error", message: "Please fix the highlighted fields.", errors, values };
  }

  const { consent: _c, ...booking } = parsed.data;

  // 1) Save to the database so it shows in Admin → Bookings.
  let saved = false;
  if (hasDatabase()) {
    try {
      await insertBooking(booking);
      saved = true;
    } catch (err) {
      console.error("Saving booking failed:", err instanceof Error ? err.message : "unknown");
    }
  }

  // 2) Alert the restaurant's phone.
  const { delivered } = await notifyRestaurant(booking, settings.alerts, settings.details.name);

  if (!saved && delivered === 0) {
    return { status: "error", message: "We couldn't send your request. Please call us to book.", values };
  }

  return {
    status: "success",
    message: `Thank you, ${booking.name.split(" ")[0]}! This is a request, not a confirmation — we'll call you to confirm your table.`,
  };
}
