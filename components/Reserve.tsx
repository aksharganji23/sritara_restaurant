import { Reveal } from "./Reveal";
import { ReserveForm } from "./ReserveForm";

export function Reserve() {
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
        <Reveal delay={0.1}><ReserveForm /></Reveal>
      </div>
    </section>
  );
}
