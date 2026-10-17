"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { Reveal } from "./Reveal";

import type { Photo } from "@/lib/content/schema";

/**
 * Bento gallery that always fills its grid with no gaps, for any number of photos.
 * Photos and their alt text are managed in Admin → Photos. Until the first upload,
 * placeholder illustrations are shown.
 */
function tileClass(i: number, n: number) {
  if (i === 0) return n === 1 ? "col-span-2 row-span-2 md:col-span-3" : "col-span-2 row-span-2";
  const classes: string[] = [];
  // Mobile (2 columns): stretch the last tile if it would sit alone.
  if (i === n - 1 && (n - 1) % 2 === 1) classes.push("col-span-2");
  // Desktop (3 columns): tiles 1 and 2 sit beside the big one; the rest go in rows of 3.
  if (n === 2) classes.push("md:col-span-1 md:row-span-2");
  else if (i >= 3 && i === n - 1) {
    const leftover = (n - 3) % 3;
    if (leftover === 1) classes.push("md:col-span-3");
    else if (leftover === 2) classes.push("md:col-span-2");
    else classes.push("md:col-span-1");
  } else if (classes.length) classes.push("md:col-span-1");
  return classes.join(" ");
}

export function Gallery({ photos }: { photos: Photo[] }) {
  if (!photos.length) return null;
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
            key={p.id}
            className={`group relative overflow-hidden rounded-2xl border border-line/60 bg-surface ${tileClass(i, photos.length)}`}
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
                unoptimized={p.placeholder}
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

              {(p.title || p.note) && (
              <figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                <span aria-hidden="true" className="block font-display text-sm text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`block font-display text-cream ${i === 0 ? "text-2xl sm:text-4xl" : "text-lg sm:text-2xl"}`}>
                  {p.title}
                </span>
                {p.note && <span className="mt-1 block text-sm text-muted transition-transform duration-500 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                  {p.note}
                </span>}
                <span
                  aria-hidden="true"
                  className="mt-3 block h-px w-10 origin-left bg-gold transition-transform duration-500 group-hover:scale-x-[3]"
                />
              </figcaption>
              )}
            </figure>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
