import type { MenuCategory, Photo, Settings } from "./schema";

/**
 * Starting content. Used:
 *  • to fill the database the first time it's connected, and
 *  • as a fallback when no database is configured (e.g. local dev without DATABASE_URL).
 * After the first run, change everything from the admin page instead of here.
 */
export const defaultSettings: Settings = {
  details: {
    name: "Sritara Classic",
    fullName: "Sritara Classic Multi Cuisine Restaurant",
    teluguName: "శ్రితర క్లాసిక్ మల్టీ కుసిన్ రెస్టారెంట్",
    tagline: "Multi-cuisine dining in the heart of Bhupalpally",
    heroTitle: "Flavours of Telangana, and beyond.",
    heroHighlight: "Telangana,",
    heroText:
      "Natukodi bagara, slow-cooked mutton, tandoor naans and Indo-Chinese favourites — served warm on Bhupalpally Main Road. Dine in or take away.",
    aboutTitle: "A neighbourhood table, set with care.",
    aboutText:
      "Sritara Classic brings together the bold, earthy cooking of Telangana — bagara rice, country chicken, quail — with North Indian curries and Indo-Chinese plates the whole family loves.\n\nGuests tell us they come back for the hygiene, the warm welcome and the food that tastes like it was made for them. That's exactly how we want it.",
    priceRange: "₹200–400 per person",
    dineIn: true,
    takeaway: true,
    delivery: false,
    announcement: "",
  },
  contact: {
    phone: "9948882244",
    whatsapp: "9948882244",
    email: "",
    street: "Bhupalpally Main Rd, near HP petrol bunk",
    city: "Bhupalpally",
    state: "Telangana",
    postalCode: "506169",
    lat: 18.433188,
    lng: 79.865063,
    zoom: 17,
  },
  hours: {
    days: Array.from({ length: 7 }, () => ({ closed: false, open: "12:00", close: "23:00" })),
  },
  rating: {
    show: true,
    value: 4.5,
    count: 26,
    reviewsUrl: "https://www.google.com/maps/search/?api=1&query=Sritara+Classic+Multi+Cuisine+Restaurant+Bhupalpally",
  },
  legal: {
    entity: "Sritara Classic Multi Cuisine Restaurant",
    fssai: "",
    gstin: "",
    grievanceOfficer: "",
  },
  booking: { enabled: true, maxGuests: 20, maxDaysAhead: 60, lastSeatingMinutes: 30 },
  alerts: { telegramChatId: "", telegramBotToken: "", callmebotPhone: "", callmebotApiKey: "" },
};

type SeedItem = Omit<MenuCategory["items"][number], "id" | "categoryId" | "sort">;
const item = (name: string, description: string, veg: boolean, spice: number, extra: Partial<SeedItem> = {}): SeedItem => ({
  name,
  telugu: "",
  description,
  price: null,
  veg,
  spice,
  signature: false,
  available: true,
  ...extra,
});

export const defaultMenu: { title: string; items: SeedItem[] }[] = [
  {
    title: "Telangana Signatures",
    items: [
      item("Natukodi Bagara", "Country-chicken curry served with fragrant bagara rice.", false, 3, { telugu: "నాటుకోడి బగారా", signature: true }),
      item("Mutton Bagara", "Slow-cooked mutton with spiced bagara rice.", false, 2, { telugu: "మటన్ బగారా", signature: true }),
      item("Kamju Pitta Fry", "Quail, dry-roasted with house masala.", false, 3, { telugu: "కంజు పిట్ట", signature: true }),
      item("Chicken Dum Biryani", "Layered basmati, marinated chicken, sealed and slow-cooked.", false, 2),
    ],
  },
  {
    title: "North Indian",
    items: [
      item("Paneer Shahi Korma", "Paneer in a rich, mildly sweet cashew-cream gravy.", true, 1, { signature: true }),
      item("Veg Kolhapuri", "Mixed vegetables in a fiery Kolhapuri masala.", true, 3),
      item("Garlic Naan", "Tandoor-baked bread brushed with garlic butter.", true, 0),
      item("Butter Naan", "Soft leavened bread from the tandoor.", true, 0),
    ],
  },
  {
    title: "Indo-Chinese",
    items: [
      item("Veg Manchurian", "Vegetable dumplings tossed in a garlic-soy sauce.", true, 2),
      item("Chilli Chicken", "Crisp chicken with peppers, green chilli and soy.", false, 2),
      item("Veg Fried Rice", "Wok-tossed rice with seasonal vegetables.", true, 1),
      item("Chicken Noodles", "Hakka noodles stir-fried with chicken and vegetables.", false, 1),
    ],
  },
];

/** Menu shape used when there's no database (ids are fake but stable). */
export const fallbackMenu: MenuCategory[] = defaultMenu.map((c, ci) => ({
  id: ci + 1,
  title: c.title,
  sort: ci,
  visible: true,
  items: c.items.map((it, ii) => ({ ...it, id: (ci + 1) * 100 + ii, categoryId: ci + 1, sort: ii })),
}));

/** Placeholder illustrations shown until the first real photo is uploaded. */
export const placeholderPhotos: Photo[] = [
  ["natukodi-bagara", "Natukodi Bagara", "Country chicken · bagara rice", "Illustration of a plate of country-chicken curry with herbs, placeholder for a photo of Natukodi Bagara"],
  ["paneer-shahi-korma", "Paneer Shahi Korma", "Cashew-cream gravy", "Illustration of paneer cubes in a golden cream gravy, placeholder for a photo of Paneer Shahi Korma"],
  ["mutton-bagara", "Mutton Bagara", "Slow-cooked mutton", "Illustration of a dark mutton curry, placeholder for a photo of Mutton Bagara"],
  ["garlic-naan", "Garlic Naan", "Fresh from the tandoor", "Illustration of three stacked naans flecked with garlic, placeholder for a photo of garlic naan"],
  ["veg-manchurian", "Veg Manchurian", "Garlic-soy glaze", "Illustration of glazed vegetable dumplings, placeholder for a photo of Veg Manchurian"],
  ["dining-room", "Our dining room", "Family tables · warm light", "Illustration of pendant lamps over a set dining table, placeholder for a photo of the dining room"],
].map(([slug, title, note, alt], i) => ({ id: slug, title, note, alt, sort: i, src: `/images/${slug}.svg`, placeholder: true }));
