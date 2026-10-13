"use client";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, Star } from "lucide-react";
import { site } from "@/lib/site";

const words = ["Flavours", "of", "Telangana,", "and", "beyond."];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative flex min-h-[100svh] items-center overflow-hidden pt-24">
      {/* Ambient glows (decorative) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-10 size-[38rem] rounded-full bg-gold/10 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 size-[30rem] rounded-full bg-ember/10 blur-[120px]" />
      </div>

      <motion.div style={{ y, opacity: fade }} className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-1.5 text-sm text-muted"
          >
            <Star aria-hidden="true" className="size-4 fill-gold text-gold" />
            <span>
              <span className="font-bold text-cream">{site.rating.value}</span> on Google · {site.rating.count} reviews
            </span>
          </motion.p>

          <h1 id="hero-title" className="mt-6 font-display text-5xl leading-[1.05] font-medium text-cream sm:text-7xl lg:text-8xl">
            <span className="sr-only">Sritara Classic — Flavours of Telangana, and beyond.</span>
            <span aria-hidden="true">
              {words.map((w, i) => (
                <span key={i} className="inline-block overflow-hidden pb-2 align-bottom">
                  <motion.span
                    className={`mr-[0.25em] inline-block ${i === 2 ? "italic text-gold" : ""}`}
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, delay: 0.15 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {w}
                  </motion.span>
                </span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted"
          >
            Natukodi bagara, slow-cooked mutton, tandoor naans and Indo-Chinese favourites — served warm on
            Bhupalpally Main Road. Dine in or take away.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link href="/#reserve" className="rounded-full bg-gold px-7 py-3.5 font-bold text-gold-deep transition-transform hover:scale-105">
              Reserve a table
            </Link>
            <Link href="/#menu" className="rounded-full border border-field px-7 py-3.5 font-semibold text-cream transition-colors hover:border-gold hover:text-gold">
              View the menu
            </Link>
          </motion.div>
        </div>

        {/* Decorative animated plate */}
        <motion.div style={{ rotate }} aria-hidden="true" className="relative mx-auto hidden aspect-square w-full max-w-md lg:block">
          <motion.svg
            viewBox="0 0 400 400"
            className="size-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <defs>
              <radialGradient id="plate" cx="50%" cy="45%">
                <stop offset="0%" stopColor="#2a231e" />
                <stop offset="100%" stopColor="#120f0d" />
              </radialGradient>
              <radialGradient id="curry" cx="45%" cy="40%">
                <stop offset="0%" stopColor="#ff9d5c" />
                <stop offset="60%" stopColor="#c8501f" />
                <stop offset="100%" stopColor="#7a2a0e" />
              </radialGradient>
            </defs>
            <circle cx="200" cy="200" r="190" fill="url(#plate)" stroke="#e9b44c" strokeOpacity=".35" />
            <motion.circle
              cx="200" cy="200" r="170" fill="none" stroke="#e9b44c" strokeWidth="1" strokeDasharray="4 10"
              animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "200px 200px" }}
            />
            <circle cx="200" cy="200" r="120" fill="url(#curry)" />
            {[...Array(14)].map((_, i) => {
              const a = (i / 14) * Math.PI * 2;
              const r = 40 + (i % 3) * 25;
              return (
                <motion.circle
                  key={i}
                  cx={200 + Math.cos(a) * r}
                  cy={200 + Math.sin(a) * r}
                  r={i % 2 ? 6 : 4}
                  fill={i % 3 ? "#6fcf8a" : "#f5efe6"}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + i * 0.05, type: "spring" }}
                />
              );
            })}
          </motion.svg>
          {/* Steam */}
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute top-1/4 h-24 w-3 rounded-full bg-cream/20 blur-md"
              style={{ left: `${40 + i * 10}%` }}
              animate={{ y: [-10, -80], opacity: [0, 0.7, 0], scaleX: [1, 2] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: i * 1.1, ease: "easeOut" }}
            />
          ))}
        </motion.div>
      </motion.div>

      <Link
        href="/#menu"
        aria-label="Scroll to menu"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-field p-3 text-muted hover:text-gold"
      >
        <motion.span className="block" animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ArrowDown aria-hidden="true" className="size-5" />
        </motion.span>
      </Link>
    </section>
  );
}
