import { Reveal } from "./Reveal";
import { ReserveForm } from "./ReserveForm";
import type { SiteInfo } from "@/lib/site";

export function Reserve({ site }: { site: SiteInfo }) {
  return (
    <section id="reserve" aria-labelledby="reserve-title" className="relative overflow-hidden py-28">
      <div aria-hidden="true" className="absolute left-1/2 top-0 size-[40rem] -translate-x-1/2 rounded-full bg-gold/10 blur-[140px] animate-flicker" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-gold">Reservations</p>
          <h2 id="reserve-title" className="mt-3 font-display text-4xl text-cream sm:text-5xl">
            Save us a <span className="italic text-gold">seat</span>
          </h2>
          <p className="mt-4 text-lg text-muted">
            Planning a family dinner or a celebration? Send a request and we&apos;ll call to confirm. We ask only for
            what we need to hold your table.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          {site.booking.enabled ? (
            <ReserveForm
              name={site.name}
              phoneDisplay={site.phoneDisplay}
              phoneE164={site.phoneE164}
              maxGuests={site.booking.maxGuests}
              maxDaysAhead={site.booking.maxDaysAhead}
            />
          ) : (
            <div className="rounded-3xl border border-line/70 bg-surface p-8 sm:p-10">
              <p className="font-display text-2xl text-cream">Book by phone</p>
              <p className="mt-2 text-muted">Online booking is paused right now. Call us and we&apos;ll hold a table for you.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={`tel:${site.phoneE164}`} className="rounded-full bg-gold px-6 py-3 font-bold text-gold-deep">
                  Call {site.phoneDisplay}
                </a>
                {site.whatsappLink && (
                  <a href={site.whatsappLink} target="_blank" rel="noopener noreferrer" className="rounded-full border border-field px-6 py-3 font-semibold text-cream hover:border-gold">
                    WhatsApp us<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
