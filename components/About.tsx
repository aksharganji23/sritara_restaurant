import { Reveal } from "./Reveal";
import { Counter } from "./Counter";
import type { SiteInfo } from "@/lib/site";

type Props = { site: SiteInfo; dishCount: number; categoryCount: number };

export function About({ site, dishCount, categoryCount }: Props) {
  const stats = [
    site.rating.show && { label: "Google rating", node: <Counter to={site.rating.value} decimals={1} suffix="★" /> },
    site.rating.show && { label: "Guest reviews", node: <Counter to={site.rating.count} /> },
    dishCount > 0 && { label: "Dishes on the menu", node: <Counter to={dishCount} /> },
    categoryCount > 0 && { label: "Menu sections", node: <Counter to={categoryCount} /> },
  ].filter(Boolean) as { label: string; node: React.ReactNode }[];

  // Split the title so its last two words can be highlighted.
  const words = site.aboutTitle.split(" ");
  const tail = words.length > 3 ? words.splice(-2).join(" ") : "";

  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-hidden bg-surface py-28">
      <div aria-hidden="true" className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_70%_30%,rgba(233,180,76,0.12),transparent_60%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-16 px-5 sm:px-8 lg:grid-cols-2">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-gold">Our story</p>
          <h2 id="about-title" className="mt-3 font-display text-4xl leading-tight text-cream sm:text-5xl">
            {words.join(" ")} {tail && <span className="italic text-gold">{tail}</span>}
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
            {site.aboutParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>

        {stats.length > 0 && (
          <Reveal delay={0.15}>
            <dl className="grid grid-cols-2 gap-5">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-line/70 bg-ink/60 p-6 backdrop-blur">
                  <dt className="text-sm text-muted">{s.label}</dt>
                  <dd className="mt-2 font-display text-5xl text-gold">{s.node}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}
      </div>
    </section>
  );
}
