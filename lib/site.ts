/**
 * Turns the admin-editable settings into everything the pages display
 * (formatted phone numbers, map links, plus code, opening hours…).
 * Content itself lives in the database — edit it at /admin.
 */
import type { Settings } from "./content/schema";
import { hoursSummary } from "./content/hours";

const PLUS_ALPHABET = "23456789CFGHJMPQRVWX";

/** Encodes coordinates as a short Google plus code, e.g. "CVM8+72". */
function toShortPlusCode(lat: number, lng: number): string {
  let la = Math.floor((Math.min(Math.max(lat, -90), 89.9999999) + 90) * 8000);
  let ln = Math.floor(((((lng + 180) % 360) + 360) % 360) * 8000);
  let code = "";
  for (let i = 0; i < 5; i++) {
    code = PLUS_ALPHABET[la % 20] + PLUS_ALPHABET[ln % 20] + code;
    la = Math.floor(la / 20);
    ln = Math.floor(ln / 20);
  }
  return `${code.slice(4, 8)}+${code.slice(8)}`;
}

/** "9948882244" → "+91 99488 82244" */
export const formatMobile = (ten: string) => `+91 ${ten.slice(0, 5)} ${ten.slice(5)}`;

export const LEGAL_LAST_UPDATED = "14 October 2026";

export function deriveSite(s: Settings) {
  const { details: d, contact: c, rating, legal, booking } = s;
  const point = `${c.lat},${c.lng}`;
  const services = [d.dineIn && "Dine-in", d.takeaway && "Takeaway", d.delivery && "Delivery"].filter(Boolean) as string[];
  return {
    name: d.name,
    fullName: d.fullName,
    teluguName: d.teluguName,
    tagline: d.tagline,
    heroTitle: d.heroTitle,
    heroHighlight: d.heroHighlight,
    heroText: d.heroText,
    aboutTitle: d.aboutTitle,
    aboutParagraphs: d.aboutText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
    announcement: d.announcement,
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.sritaraclassic.in",
    phoneDisplay: formatMobile(c.phone),
    phoneE164: `+91${c.phone}`,
    whatsappLink: c.whatsapp ? `https://wa.me/91${c.whatsapp}` : "",
    email: c.email,
    address: { street: c.street, city: c.city, state: c.state, postalCode: c.postalCode, country: "IN" },
    geo: { lat: c.lat, lng: c.lng },
    plusCode: `${toShortPlusCode(c.lat, c.lng)} ${c.city}, ${c.state}`,
    priceRange: d.priceRange,
    services,
    hoursWeek: s.hours.days,
    hours: hoursSummary(s.hours.days),
    rating,
    mapsLink: rating.reviewsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${d.fullName} ${c.city}`)}`,
    pinLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(point)}`,
    directionsLink: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(point)}`,
    mapsEmbed: `https://www.google.com/maps?q=${point}&z=${c.zoom}&hl=en&output=embed`,
    legal: { ...legal, lastUpdated: LEGAL_LAST_UPDATED },
    booking,
  };
}

export type SiteInfo = ReturnType<typeof deriveSite>;

export const navLinks = [
  { href: "/#menu", label: "Menu" },
  { href: "/#about", label: "About" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#visit", label: "Visit" },
  { href: "/#reserve", label: "Reserve" },
] as const;

export const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/refund-policy", label: "Refund Policy" },
] as const;
