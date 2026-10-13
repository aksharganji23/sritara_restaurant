/**
 * Single source of truth for restaurant details.
 * ⚠️ Items marked VERIFY came from the public Google listing or are placeholders —
 * confirm them with the owner before going live.
 */
export const site = {
  name: "Sritara Classic",
  fullName: "Sritara Classic Multi Cuisine Restaurant",
  teluguName: "శ్రితర క్లాసిక్ మల్టీ కుసిన్ రెస్టారెంట్",
  tagline: "Multi-cuisine dining in the heart of Bhupalpally",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.sritaraclassic.in", // VERIFY domain
  phoneDisplay: "079896 64076",
  phoneE164: "+917989664076",
  email: "hello@sritaraclassic.in", // VERIFY — placeholder
  address: {
    street: "Bhupalpally Main Rd, near HP petrol bunk",
    city: "Bhupalpally",
    state: "Telangana",
    postalCode: "506169",
    country: "IN",
  },
  // Exact point decoded from the Google plus code CVM8+72 (7JCXCVM8+72).
  geo: { lat: 18.423188, lng: 79.865063 },
  plusCode: "CVM8+72 Bhupalpally, Telangana",
  priceRange: "₹200–400 per person",
  // VERIFY — listing shows "Opens 12 pm, closes 11 pm"; confirm weekly schedule.
  hours: [{ days: "Monday – Sunday", time: "12:00 PM – 11:00 PM" }],
  services: ["Dine-in", "Takeaway"],
  rating: { value: 4.5, count: 26 }, // Google rating at time of build — update or remove
  /** Google Maps place search by name — used for "Read all reviews". */
  mapsLink: "https://www.google.com/maps/search/?api=1&query=Sritara+Classic+Multi+Cuisine+Restaurant+Bhupalpally",
  /** Drops a pin exactly on the restaurant (plus code CVM8+72). */
  pinLink: "https://www.google.com/maps/search/?api=1&query=18.423188%2C79.865063",
  /** Turn-by-turn directions from the visitor's location to the restaurant. */
  directionsLink: "https://www.google.com/maps/dir/?api=1&destination=18.423188%2C79.865063",
  /** Embedded map centred and pinned on the restaurant. */
  mapsEmbed: "https://www.google.com/maps?q=18.423188,79.865063&z=17&hl=en&output=embed",
  legal: {
    // VERIFY — legal entity, GSTIN and FSSAI licence must be filled in.
    entity: "Sritara Classic Multi Cuisine Restaurant",
    fssai: "[FSSAI licence number]",
    grievanceOfficer: "[Name of Grievance Officer]",
    lastUpdated: "13 October 2026",
  },
} as const;

export type MenuItem = {
  name: string;
  telugu?: string;
  description: string;
  veg: boolean;
  spice?: 1 | 2 | 3;
  signature?: boolean;
};

export type MenuCategory = { id: string; title: string; items: MenuItem[] };

/** VERIFY — dishes are drawn from guest reviews; get the real menu + prices from the owner. */
export const menu: MenuCategory[] = [
  {
    id: "signatures",
    title: "Telangana Signatures",
    items: [
      { name: "Natukodi Bagara", telugu: "నాటుకోడి బగారా", description: "Country-chicken curry served with fragrant bagara rice.", veg: false, spice: 3, signature: true },
      { name: "Mutton Bagara", telugu: "మటన్ బగారా", description: "Slow-cooked mutton with spiced bagara rice.", veg: false, spice: 2, signature: true },
      { name: "Kamju Pitta Fry", telugu: "కంజు పిట్ట", description: "Quail, dry-roasted with house masala.", veg: false, spice: 3, signature: true },
      { name: "Chicken Dum Biryani", description: "Layered basmati, marinated chicken, sealed and slow-cooked.", veg: false, spice: 2 },
    ],
  },
  {
    id: "north-indian",
    title: "North Indian",
    items: [
      { name: "Paneer Shahi Korma", description: "Paneer in a rich, mildly sweet cashew-cream gravy.", veg: true, spice: 1, signature: true },
      { name: "Veg Kolhapuri", description: "Mixed vegetables in a fiery Kolhapuri masala.", veg: true, spice: 3 },
      { name: "Garlic Naan", description: "Tandoor-baked bread brushed with garlic butter.", veg: true },
      { name: "Butter Naan", description: "Soft leavened bread from the tandoor.", veg: true },
    ],
  },
  {
    id: "indo-chinese",
    title: "Indo-Chinese",
    items: [
      { name: "Veg Manchurian", description: "Vegetable dumplings tossed in a garlic-soy sauce.", veg: true, spice: 2 },
      { name: "Chilli Chicken", description: "Crisp chicken with peppers, green chilli and soy.", veg: false, spice: 2 },
      { name: "Veg Fried Rice", description: "Wok-tossed rice with seasonal vegetables.", veg: true, spice: 1 },
      { name: "Chicken Noodles", description: "Hakka noodles stir-fried with chicken and vegetables.", veg: false, spice: 1 },
    ],
  },
];

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
