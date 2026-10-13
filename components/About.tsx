import { Reveal } from "./Reveal";
import { Counter } from "./Counter";
import { site } from "@/lib/site";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-hidden bg-surface py-28">
      <div aria-hidden="true" className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_70%_30%,rgba(233,180,76,0.12),transparent_60%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-16 px-5 sm:px-8 lg:grid-cols-2">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-gold">Our story</p>
          <h2 id="about-title" className="mt-3 font-display text-4xl leading-tight text-cream sm:text-5xl">
            A neighbourhood table, <span className="italic text-gold">set with care.</span>
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
            {/* VERIFY — replace with the owner's real story */}
            <p>
              Sritara Classic brings together the bold, earthy cooking of Telangana — bagara rice, country chicken,
              quail — with North Indian curries and Indo-Chinese plates the whole family loves.
            </p>
            <p>
              Guests tell us they come back for the hygiene, the warm welcome and the food that tastes like it was
              made for them. That&apos;s exactly how we want it.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <dl className="grid grid-cols-2 gap-5">
            {[
              { label: "Google rating", node: <Counter to={site.rating.value} decimals={1} suffix="★" /> },
              { label: "Guest reviews", node: <Counter to={site.rating.count} suffix="+" /> },
              { label: "Hours open daily", node: <Counter to={11} /> },
              { label: "Cuisines", node: <Counter to={3} /> },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-line/70 bg-ink/60 p-6 backdrop-blur">
                <dt className="text-sm text-muted">{s.label}</dt>
                <dd className="mt-2 font-display text-5xl text-gold">{s.node}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
