"use client";
import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Map as MapIcon, Navigation } from "lucide-react";
import { site } from "@/lib/site";

/**
 * Location card with a pin pointing at the restaurant.
 *
 * The Google Map iframe shares the visitor's IP with Google and may set cookies,
 * so it loads only after a click. The choice is kept in memory only (no cookie /
 * localStorage). "Get directions" is a plain link: nothing reaches Google until
 * the visitor follows it.
 */
export function ConsentMap() {
  const [load, setLoad] = useState(false);

  const directions = (
    <a
      href={site.directionsLink}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-gold-deep transition-transform hover:scale-105"
    >
      <Navigation aria-hidden="true" className="size-4" />
      Get directions
      <span className="sr-only"> to {site.name} in Google Maps (opens in a new tab)</span>
    </a>
  );

  if (load) {
    return (
      <div className="flex size-full flex-col gap-4">
        <iframe
          title={`Google Map with a pin on ${site.name}, ${site.address.street}, ${site.address.city}`}
          src={site.mapsEmbed}
          className="min-h-[380px] w-full flex-1 rounded-2xl border border-line/60"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        />
        <div className="flex flex-wrap items-center gap-3">
          {directions}
          <a
            href={site.pinLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline underline-offset-4"
          >
            View pin in Google Maps<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-line/60 bg-surface">
      {/* Schematic street view — decorative, not to scale */}
      <div aria-hidden="true" className="relative h-56 shrink-0 overflow-hidden sm:h-64">
        <svg viewBox="0 0 600 260" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M30 0H0V30" fill="none" stroke="#4a4038" strokeOpacity=".35" strokeWidth="1" />
            </pattern>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e9b44c" stopOpacity=".35" />
              <stop offset="100%" stopColor="#e9b44c" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="600" height="260" fill="#14110f" />
          <rect width="600" height="260" fill="url(#grid)" />
          {/* Side streets */}
          <path d="M120 0 L150 260" stroke="#2b241f" strokeWidth="18" />
          <path d="M470 0 L440 260" stroke="#2b241f" strokeWidth="18" />
          {/* Main road */}
          <path d="M-20 175 C 150 160, 420 190, 620 165" stroke="#3a322b" strokeWidth="38" fill="none" />
          <motion.path
            d="M-20 175 C 150 160, 420 190, 620 165"
            stroke="#e9b44c"
            strokeOpacity=".55"
            strokeWidth="2"
            strokeDasharray="14 14"
            fill="none"
            animate={{ strokeDashoffset: [0, -56] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          />
          <text x="40" y="222" fill="#b8ad9f" fontSize="13" fontFamily="system-ui, sans-serif" letterSpacing="1">
            BHUPALPALLY MAIN RD
          </text>
          {/* Landmark: petrol bunk */}
          <g transform="translate(372 108)">
            <rect x="-26" y="-18" width="52" height="34" rx="6" fill="#221d19" stroke="#857868" />
            <text x="0" y="4" textAnchor="middle" fill="#f5efe6" fontSize="12" fontWeight="700" fontFamily="system-ui, sans-serif">HP</text>
            <text x="0" y="34" textAnchor="middle" fill="#b8ad9f" fontSize="11" fontFamily="system-ui, sans-serif">petrol bunk</text>
          </g>
          {/* Glow under the pin */}
          <circle cx="300" cy="130" r="70" fill="url(#glow)" />
        </svg>

        {/* Pulsing ring + dropping pin, centred over the restaurant */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {[0, 1].map((i) => (
            <motion.span
              key={i}
              className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold"
              initial={{ scale: 0.3, opacity: 0.8 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 1.1, ease: "easeOut" }}
            />
          ))}
          <span className="absolute left-1/2 top-1/2 h-2 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/60 blur-[2px]" />
        </div>
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full"
          initial={{ y: -60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.2 }}
        >
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
            <svg viewBox="0 0 40 52" className="h-14 w-11 drop-shadow-[0_6px_10px_rgba(0,0,0,0.6)]">
              <path d="M20 51C20 51 38 31 38 19A18 18 0 1 0 2 19C2 31 20 51 20 51Z" fill="#e9b44c" stroke="#1a1208" strokeWidth="2" />
              <path d="M20 9l2.6 6.2 6.7.4-5.2 4.3 1.7 6.5L20 22.8l-5.8 3.6 1.7-6.5-5.2-4.3 6.7-.4z" fill="#1a1208" />
            </svg>
          </motion.div>
        </motion.div>
        <motion.span
          className="absolute left-1/2 top-1/2 ml-8 -translate-y-[170%] whitespace-nowrap rounded-full bg-ink/90 px-3 py-1 text-sm font-semibold text-cream ring-1 ring-gold/60"
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
        >
          {site.name}
        </motion.span>
        <span className="absolute bottom-2 right-3 text-xs text-muted">Not to scale</span>
      </div>

      {/* Location details */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <p className="font-display text-xl text-cream">We&apos;re right here</p>
          <p className="mt-1 text-muted">
            {site.address.street}, {site.address.city}
          </p>
          <p className="mt-1 text-sm text-muted">
            Plus code <span className="font-mono text-cream">{site.plusCode}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {directions}
          <button
            type="button"
            onClick={() => setLoad(true)}
            className="inline-flex items-center gap-2 rounded-full border border-field px-6 py-3 font-semibold text-cream transition-colors hover:border-gold hover:text-gold"
          >
            <MapIcon aria-hidden="true" className="size-4" />
            Load Google Map
          </button>
        </div>

        <p className="text-sm text-muted">
          The map and directions are provided by Google. Loading the map shares your IP address with Google and may set
          cookies. <Link href="/cookie-policy" className="text-gold underline underline-offset-4">Learn more</Link>.
        </p>
      </div>
    </div>
  );
}
