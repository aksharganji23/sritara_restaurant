"use server";
import { headers } from "next/headers";
import { reservationSchema, type FormState } from "@/lib/reservation-schema";

// Best-effort in-memory rate limit. On serverless hosting each instance has its
// own memory — use Upstash/Redis or your host's firewall for real protection.
const hits = new Map<string, { count: number; reset: number }>();
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

function rateLimited(key: string) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.reset < now) {
    hits.set(key, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > LIMIT;
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

  const parsed = reservationSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: FormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<FormState["errors"]>;
      if (key && !errors[key]) errors[key] = issue.message;
    }
    return { status: "error", message: "Please fix the highlighted fields.", errors, values };
  }

  const webhook = process.env.RESERVATION_WEBHOOK_URL;
  if (!webhook) {
    return {
      status: "error",
      message: "Online booking isn't switched on yet. Please call us to reserve.",
      values,
    };
  }

  try {
    const { consent: _c, ...booking } = parsed.data;
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...booking, submittedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Webhook ${res.status}`);
  } catch (err) {
    // Log the failure, never the guest's personal data.
    console.error("Reservation forwarding failed:", err instanceof Error ? err.message : "unknown");
    return { status: "error", message: "We couldn't send your request. Please call us to book.", values };
  }

  return {
    status: "success",
    message: `Thank you, ${parsed.data.name.split(" ")[0]}! This is a request, not a confirmation — we'll call you to confirm your table.`,
  };
}
