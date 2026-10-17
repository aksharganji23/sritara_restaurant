import Link from "next/link";
import { Check, MessageCircle, Phone, RotateCcw, Trash2, X } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { hasDatabase } from "@/lib/db";
import { listBookings } from "@/lib/content/store";
import { formatTime } from "@/lib/content/hours";
import { formatMobile } from "@/lib/site";
import type { Booking } from "@/lib/content/schema";
import { PageHeader } from "@/components/admin/PageHeader";
import { AutoRefresh } from "@/components/admin/AutoRefresh";
import { ActionButton } from "@/components/admin/ui";
import { deleteBookingAction, setBookingStatusAction } from "../../actions";

export const metadata = { title: "Bookings" };

const STATUS = {
  new: { label: "Needs a call", cls: "bg-gold text-gold-deep" },
  confirmed: { label: "Confirmed", cls: "bg-leaf/20 text-leaf" },
  cancelled: { label: "Cancelled", cls: "bg-danger/15 text-danger" },
} as const;

const dayLabel = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export default async function BookingsPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  await requireAdmin();
  const view = (await searchParams).view === "past" ? "past" : "upcoming";

  let bookings: Booking[] = [];
  let failed = false;
  if (hasDatabase()) {
    try {
      bookings = await listBookings(view);
    } catch (err) {
      console.error("Loading bookings failed:", err instanceof Error ? err.message : err);
      failed = true;
    }
  }

  const byDate = new Map<string, Booking[]>();
  for (const b of bookings) byDate.set(b.date, [...(byDate.get(b.date) ?? []), b]);

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Table requests from the website. Call each guest, then mark it confirmed or cancelled. Bookings are deleted automatically 30 days after their date."
      />

      <AutoRefresh pending={view === "upcoming" ? bookings.filter((b) => b.status === "new").length : undefined} />

      <nav aria-label="Booking views" className="mb-6 flex gap-2">
        {(["upcoming", "past"] as const).map((v) => (
          <Link
            key={v}
            href={`/admin/bookings${v === "past" ? "?view=past" : ""}`}
            aria-current={view === v ? "page" : undefined}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${view === v ? "bg-gold text-gold-deep" : "border border-field text-cream hover:border-gold"}`}
          >
            {v === "upcoming" ? "Today & upcoming" : "Past"}
          </Link>
        ))}
      </nav>

      {failed && <p role="alert" className="text-danger">Couldn&apos;t load bookings — the database didn&apos;t respond.</p>}
      {!failed && bookings.length === 0 && (
        <p className="rounded-2xl border border-dashed border-line p-10 text-center text-muted">
          {view === "upcoming" ? "No upcoming bookings yet." : "No past bookings in the last 30 days."}
        </p>
      )}

      <div className="space-y-8">
        {[...byDate.entries()].map(([date, list]) => (
          <section key={date} aria-labelledby={`d-${date}`}>
            <h2 id={`d-${date}`} className="mb-3 text-sm font-bold uppercase tracking-wider text-gold">{dayLabel(date)}</h2>
            <ul className="space-y-3">
              {list.map((b) => (
                <li key={b.id} className={`rounded-2xl border bg-surface p-5 ${b.status === "new" ? "border-gold/70" : "border-line"}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold text-cream">
                        {formatTime(b.time)} · {b.name}
                      </p>
                      <p className="text-muted">
                        {b.guests} {b.guests === 1 ? "guest" : "guests"} · {formatMobile(b.phone)}
                      </p>
                      {b.notes && <p className="mt-2 text-cream">“{b.notes}”</p>}
                      <p className="mt-2 text-xs text-muted">
                        Requested {new Date(b.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS[b.status].cls}`}>{STATUS[b.status].label}</span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <a href={`tel:+91${b.phone}`} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-1.5 text-sm text-cream hover:text-gold">
                      <Phone aria-hidden="true" className="size-4" /> Call {b.name.split(" ")[0]}
                    </a>
                    <a
                      href={`https://wa.me/91${b.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-1.5 text-sm text-cream hover:text-gold"
                    >
                      <MessageCircle aria-hidden="true" className="size-4" /> WhatsApp<span className="sr-only"> {b.name} (opens in a new tab)</span>
                    </a>
                    {b.status !== "confirmed" && (
                      <ActionButton action={setBookingStatusAction} fields={{ id: b.id, status: "confirmed" }} tone="primary" label="Confirm" srLabel={`Mark ${b.name}'s booking as confirmed`}>
                        <Check aria-hidden="true" className="size-4" />
                      </ActionButton>
                    )}
                    {b.status !== "cancelled" && (
                      <ActionButton action={setBookingStatusAction} fields={{ id: b.id, status: "cancelled" }} label="Cancel" srLabel={`Mark ${b.name}'s booking as cancelled`}>
                        <X aria-hidden="true" className="size-4" />
                      </ActionButton>
                    )}
                    {b.status !== "new" && (
                      <ActionButton action={setBookingStatusAction} fields={{ id: b.id, status: "new" }} label="Undo" srLabel={`Undo: set ${b.name}'s booking back to needs a call`}>
                        <RotateCcw aria-hidden="true" className="size-4" />
                      </ActionButton>
                    )}
                    <ActionButton
                      action={deleteBookingAction}
                      fields={{ id: b.id }}
                      tone="danger"
                      label="Delete"
                      srLabel={`Delete ${b.name}'s booking`}
                      confirmText={`Delete ${b.name}'s booking? This can't be undone.`}
                    >
                      <Trash2 aria-hidden="true" className="size-4" />
                    </ActionButton>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
