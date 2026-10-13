import { Quote, Star } from "lucide-react";
import { Reveal } from "./Reveal";
import { site } from "@/lib/site";

/**
 * Themes summarised from public Google reviews (paraphrased, no reviewer names).
 * ⚠️ Don't paste reviewers' words or names onto the site without their permission.
 */
const highlights = [
  { title: "Paneer Shahi Korma", body: "Guests single out the paneer korma as rich and full of flavour." },
  { title: "Telangana specials", body: "Natukodi bagara, mutton bagara and kamju pitta are repeat recommendations." },
  { title: "Warm hospitality", body: "Reviewers mention welcoming staff and a pleasant, hygienic dining room." },
  { title: "Family friendly", body: "A popular pick for dinners with family and friends." },
];

export function Reviews() {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="bg-surface py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-gold">What guests say</p>
            <h2 id="reviews-title" className="mt-3 font-display text-4xl text-cream sm:text-5xl">Loved by Bhupalpally</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex" role="img" aria-label={`Rated ${site.rating.value} out of 5`}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} aria-hidden="true" className={`size-5 ${i < Math.round(site.rating.value) ? "fill-gold text-gold" : "text-line"}`} />
              ))}
            </div>
            <p className="text-muted">
              <span className="font-bold text-cream">{site.rating.value}</span> from {site.rating.count} Google reviews
            </p>
          </div>
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h, i) => (
            <li key={h.title}>
              <Reveal delay={i * 0.1} className="h-full rounded-2xl border border-line/70 bg-ink p-6">
                <Quote aria-hidden="true" className="size-7 text-gold" />
                <h3 className="mt-4 font-display text-xl text-cream">{h.title}</h3>
                <p className="mt-2 text-muted">{h.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <a
          href={site.mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center gap-2 font-semibold text-gold underline underline-offset-4"
        >
          Read all reviews on Google Maps<span className="sr-only"> (opens in a new tab)</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
