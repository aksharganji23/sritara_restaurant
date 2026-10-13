"use client";
import { useState } from "react";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Google Maps sets its own cookies and receives the visitor's IP address.
 * So the iframe is NOT loaded until the visitor clicks. The choice is kept
 * in memory only (no cookie / localStorage), so nothing is stored.
 */
export function ConsentMap() {
  const [load, setLoad] = useState(false);

  if (load) {
    return (
      <iframe
        title={`Google Map showing ${site.name}, ${site.address.city}`}
        src={site.mapsEmbed}
        className="size-full min-h-[380px] rounded-2xl border border-line/60 grayscale invert-[0.92] hue-rotate-180"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    );
  }

  return (
    <div className="flex size-full min-h-[380px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-line bg-surface p-8 text-center">
      <MapPin aria-hidden="true" className="size-10 text-gold" />
      <p className="max-w-sm text-muted">
        The map is provided by Google. Loading it shares your IP address with Google and may set cookies.{" "}
        <Link href="/cookie-policy" className="text-gold underline underline-offset-4">Learn more</Link>.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => setLoad(true)}
          className="rounded-full bg-gold px-6 py-3 font-bold text-gold-deep transition-transform hover:scale-105"
        >
          Load Google Map
        </button>
        <a
          href={site.mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-field px-6 py-3 font-semibold text-cream hover:border-gold"
        >
          Open in Google Maps<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
