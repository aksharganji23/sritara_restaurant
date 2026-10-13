"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Flame, Sparkles } from "lucide-react";
import { menu } from "@/lib/site";
import { Reveal } from "./Reveal";

/** Accessible tabs (WAI-ARIA Authoring Practices): arrow keys, Home/End. */
export function MenuSection() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const last = menu.length - 1;
    const next =
      e.key === "ArrowRight" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  const cat = menu[active];

  return (
    <section id="menu" aria-labelledby="menu-title" className="mx-auto max-w-7xl px-5 py-28 sm:px-8">
      <Reveal>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-gold">The menu</p>
        <h2 id="menu-title" className="mt-3 font-display text-4xl text-cream sm:text-6xl">
          Something for <span className="italic">every</span> table
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          A taste of what we cook. Ask our staff for today&apos;s specials and current prices.
        </p>
      </Reveal>

      <div role="tablist" aria-label="Menu categories" className="mt-12 flex flex-wrap gap-2">
        {menu.map((c, i) => (
          <button
            key={c.id}
            ref={(el) => { tabs.current[i] = el; }}
            role="tab"
            type="button"
            id={`tab-${c.id}`}
            aria-selected={active === i}
            aria-controls={`panel-${c.id}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              active === i ? "text-gold-deep" : "text-muted hover:text-cream"
            }`}
          >
            {active === i && (
              <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-gold" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
            )}
            <span className="relative">{c.title}</span>
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${cat.id}`} aria-labelledby={`tab-${cat.id}`} tabIndex={0} className="mt-10 rounded-3xl">
        <AnimatePresence mode="wait">
          <motion.ul
            key={cat.id}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
            variants={{ show: { transition: { staggerChildren: 0.07 } } }}
            className="grid gap-5 md:grid-cols-2"
          >
            {cat.items.map((item) => (
              <motion.li
                key={item.name}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-line/70 bg-surface p-6 transition-colors hover:border-gold/60"
              >
                <div aria-hidden="true" className="absolute -right-16 -top-16 size-40 rounded-full bg-gold/0 blur-2xl transition-colors duration-500 group-hover:bg-gold/15" />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl text-cream">
                      {item.name}
                      {item.telugu && <span lang="te" className="ml-2 font-sans text-base text-muted">{item.telugu}</span>}
                    </h3>
                    <p className="mt-2 text-muted">{item.description}</p>
                  </div>
                  <span
                    className={`mt-1 grid size-5 shrink-0 place-items-center rounded-sm border-2 ${item.veg ? "border-leaf" : "border-ember"}`}
                    role="img"
                    aria-label={item.veg ? "Vegetarian" : "Non-vegetarian"}
                    title={item.veg ? "Vegetarian" : "Non-vegetarian"}
                  >
                    <span className={`size-2 rounded-full ${item.veg ? "bg-leaf" : "bg-ember"}`} />
                  </span>
                </div>
                <div className="relative mt-4 flex flex-wrap gap-3 text-sm">
                  {item.signature && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-3 py-1 font-semibold text-gold">
                      <Sparkles aria-hidden="true" className="size-3.5" /> Guest favourite
                    </span>
                  )}
                  {item.spice && (
                    <span className="inline-flex items-center gap-1 text-ember">
                      <span className="sr-only">Spice level {item.spice} of 3</span>
                      {[...Array(item.spice)].map((_, i) => (
                        <Flame key={i} aria-hidden="true" className="size-4" />
                      ))}
                    </span>
                  )}
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
      <p className="mt-8 text-sm text-muted">
        Allergies or dietary needs? Please tell our staff before ordering — dishes are prepared in a shared kitchen.
      </p>
    </section>
  );
}
