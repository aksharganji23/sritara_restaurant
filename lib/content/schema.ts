import { z } from "zod";

/**
 * Shapes of everything the admin can edit. Each settings "section" is saved
 * as one JSON row in the `settings` table and validated with these schemas
 * both when saving (admin) and when reading (customer site).
 */

const text = (max: number) => z.string().trim().max(max, `Keep this under ${max} characters.`);
const required = (label: string, max: number) => text(max).min(1, `${label} is required.`);
const mobile = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, "").replace(/^(\+91|0)/, ""))
  .pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number."));
const optionalMobile = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, "").replace(/^(\+91|0)/, ""))
  .pipe(z.union([z.literal(""), z.string().regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number, or leave it empty.")]));
const hhmm = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use a time like 12:00.");

export const detailsSchema = z.object({
  name: required("Short name", 60),
  fullName: required("Full name", 120),
  teluguName: text(160),
  tagline: text(160),
  heroTitle: required("Headline", 80),
  heroHighlight: text(40),
  heroText: text(400),
  aboutTitle: text(100),
  aboutText: text(2000),
  priceRange: text(60),
  dineIn: z.boolean(),
  takeaway: z.boolean(),
  delivery: z.boolean(),
  announcement: text(200),
});

export const contactSchema = z.object({
  phone: mobile,
  whatsapp: optionalMobile,
  email: z.union([z.literal(""), z.email("Enter a valid email, or leave it empty.")]),
  street: required("Street", 160),
  city: required("City", 60),
  state: required("State", 60),
  postalCode: z.string().trim().regex(/^\d{6}$/, "Enter a 6-digit PIN code."),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  zoom: z.coerce.number().int().min(10, "Zoom 10–20.").max(20, "Zoom 10–20."),
});

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

export const dayHoursSchema = z.object({ closed: z.boolean(), open: hhmm, close: hhmm });
export const hoursSchema = z.object({ days: z.array(dayHoursSchema).length(7) });

export const ratingSchema = z.object({
  show: z.boolean(),
  value: z.coerce.number().min(0).max(5),
  count: z.coerce.number().int().min(0).max(1_000_000),
  reviewsUrl: z.union([z.literal(""), z.url("Enter a full link starting with https://")]),
});

export const legalSchema = z.object({
  entity: required("Legal name", 160),
  fssai: text(40),
  gstin: text(20),
  grievanceOfficer: text(100),
});

export const bookingSchema = z.object({
  enabled: z.boolean(),
  maxGuests: z.coerce.number().int().min(1).max(200),
  maxDaysAhead: z.coerce.number().int().min(1).max(365),
  lastSeatingMinutes: z.coerce.number().int().min(0).max(240),
});

export const alertsSchema = z.object({
  telegramChatId: text(40),
  telegramBotToken: text(120),
  callmebotPhone: optionalMobile,
  callmebotApiKey: text(60),
});

export const sectionSchemas = {
  details: detailsSchema,
  contact: contactSchema,
  hours: hoursSchema,
  rating: ratingSchema,
  legal: legalSchema,
  booking: bookingSchema,
  alerts: alertsSchema,
} as const;

export type SectionKey = keyof typeof sectionSchemas;
export type Settings = { [K in SectionKey]: z.infer<(typeof sectionSchemas)[K]> };

export const menuItemSchema = z.object({
  name: required("Dish name", 80),
  telugu: text(80),
  description: text(300),
  price: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : Number(v)))
    .pipe(z.number().int("Whole rupees only.").min(0).max(100_000).nullable()),
  veg: z.boolean(),
  spice: z.coerce.number().int().min(0).max(3),
  signature: z.boolean(),
  available: z.boolean(),
});

export type MenuItem = z.infer<typeof menuItemSchema> & { id: number; categoryId: number; sort: number };
export type MenuCategory = { id: number; title: string; sort: number; visible: boolean; items: MenuItem[] };

export type Photo = { id: string; title: string; note: string; alt: string; sort: number; src: string; placeholder?: boolean };

export type BookingStatus = "new" | "confirmed" | "cancelled";
export type Booking = {
  id: number;
  createdAt: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes: string;
  status: BookingStatus;
};
