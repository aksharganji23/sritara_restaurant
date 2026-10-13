"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { Reveal } from "./Reveal";

/**
 * ⚠️ Placeholder artwork. Replace with real photos the restaurant OWNS
 * (don't copy from Google Maps — those belong to the uploaders).
 * Keep alt text descriptive: what's on the plate, not "image of food".
 */
const photos = [
  { src: "/images/natukodi-bagara.svg", alt: "Natukodi bagara: country-chicken curry in a copper bowl beside a plate of bagara rice", span: "md:row-span-2" },
  { src: "/images/paneer-shahi-korma.svg", alt: "Paneer shahi korma in a creamy cashew gravy, garnished with fresh cream and coriander", span: "" },
  { src: "/images/garlic-naan.svg", alt: "Stack of garlic naans brushed with butter and chopped garlic", span: "" },
  { src: "/images/mutton-bagara.svg", alt: "Mutton bagara with tender bone-in mutton pieces over spiced rice", span: "md:row-span-2" },
  { src: "/images/veg-manchurian.svg", alt: "Veg manchurian balls glazed in dark garlic-soy sauce with spring onions", span: "" },
  { src: "/images/dining-room.svg", alt: "Warmly lit dining room with family tables set for dinner", span: "" },
];

export function Gallery() {
  return (
    <section aria-labelledby="gallery-title" className="mx-auto max-w-7xl px-5 py-28 sm:px-8">
      <Reveal>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-gold">From our kitchen</p>
        <h2 id="gallery-title" className="mt-3 font-display text-4xl text-cream sm:text-5xl">A feast for the eyes</h2>
      </Reveal>
      <ul className="mt-12 grid auto-rows-[220px] grid-cols-2 gap-4 md:grid-cols-3">
        {photos.map((p, i) => (
          <motion.li
            key={p.src}
            className={`group relative overflow-hidden rounded-2xl border border-line/60 ${p.span}`}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: (i % 3) * 0.1 }}
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              unoptimized /* remove once you switch to real JPG/WebP photos */
              sizes="(min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
