"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { Reveal } from "./Reveal";

/**
 * Bento gallery: 3 rows × 3 columns on desktop, 2 columns on mobile — every cell filled, no gaps.
 *
 * ⚠️ PLACEHOLDERS: the images are illustrations, so the alt text describes the
 * illustration honestly. When you swap in real photos the restaurant OWNS:
 *   1. replace `src` (JPG/WebP, ideally ≥ 1600px on the long side),
 *   2. rewrite `alt` to describe what is actually in that photo,
 *   3. set `placeholder: false`,
 *   4. remove `unoptimized` below so Next.js serves AVIF/WebP.
 */
type Photo = {
  src: string;
  alt: string;
  title: string;
  note: string;
  layout: string;
  placeholder: boolean;
};

const photos: Photo[] = [
  {
    src: "/images/natukodi-bagara.svg",
    alt: "Illustration of a plate of country-chicken curry with herbs, placeholder for a photo of Natukodi Bagara",
    title: "Natukodi Bagara",
    note: "Country chicken · bagara rice",
    layout: "col-span-2 row-span-2",
    placeholder: true,
  },
  {
    src: "/images/paneer-shahi-korma.svg",
    alt: "Illustration of paneer cubes in a golden cream gravy, placeholder for a photo of Paneer Shahi Korma",
    title: "Paneer Shahi Korma",
    note: "Cashew-cream gravy",
    layout: "",
    placeholder: true,
  },
  {
    src: "/images/mutton-bagara.svg",
    alt: "Illustration of a dark mutton curry, placeholder for a photo of Mutton Bagara",
    title: "Mutton Bagara",
    note: "Slow-cooked mutton",
    layout: "",
    placeholder: true,
  },
  {
    src: "/images/garlic-naan.svg",
    alt: "Illustration of three stacked naans flecked with garlic, placeholder for a photo of garlic naan",
    title: "Garlic Naan",
    note: "Fresh from the tandoor",
    layout: "",
    placeholder: true,
  },
  {
    src: "/images/veg-manchurian.svg",
    alt: "Illustration of glazed vegetable dumplings, placeholder for a photo of Veg Manchurian",
    title: "Veg Manchurian",
    note: "Garlic-soy glaze",
    layout: "",
    placeholder: true,
  },
  {
    src: "/images/dining-room.svg",
    alt: "Illustration of pendant lamps over a set dining table, placeholder for a photo of the dining room",
    title: "Our dining room",
    note: "Family tables · warm light",
    // Spans both columns on mobile so the last row isn't half-empty.
    layout: "col-span-2 md:col-span-1",
    placeholder: true,
  },
];

export function Gallery() {
  return (
    <section aria-labelledby="gallery-title" className="mx-auto max-w-7xl px-5 py-28 sm:px-8">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-gold">From our kitchen</p>
          <h2 id="gallery-title" className="mt-3 font-display text-4xl text-cream sm:text-5xl">
            A feast for the <span className="italic text-gold">eyes</span>
          </h2>
        </div>
        <p className="max-w-sm text-muted">Signature plates and the room you&apos;ll enjoy them in.</p>
      </Reveal>

      <ul className="mt-12 grid auto-rows-[170px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:gap-4 md:grid-cols-3 md:auto-rows-[240px]">
        {photos.map((p, i) => (
          <motion.li
            key={p.src}
            className={`group relative overflow-hidden rounded-2xl border border-line/60 bg-surface ${p.layout}`}
            initial={{ opacity: 0, clipPath: "inset(18% 0% 0% 0% round 16px)" }}
            whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 16px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <figure className="relative size-full">
              <Image
                src={p.src}
                alt={p.alt}
                fill
                unoptimized /* remove once you switch to real JPG/WebP photos */
                sizes={i === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 50vw"}
                className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
              />

              {/* Legibility scrim: keeps caption text above 4.5:1 regardless of the photo */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100"
              />

              {p.placeholder && (
                <span className="absolute left-3 top-3 rounded-full border border-field bg-ink/80 px-2.5 py-1 text-xs font-semibold text-muted backdrop-blur">
                  Placeholder image
                </span>
              )}

              <figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                <span aria-hidden="true" className="block font-display text-sm text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`block font-display text-cream ${i === 0 ? "text-2xl sm:text-4xl" : "text-lg sm:text-2xl"}`}>
                  {p.title}
                </span>
                <span className="mt-1 block text-sm text-muted transition-transform duration-500 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                  {p.note}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-3 block h-px w-10 origin-left bg-gold transition-transform duration-500 group-hover:scale-x-[3]"
                />
              </figcaption>
            </figure>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
