import { z } from "zod";

/**
 * Data minimisation: only what's needed to hold a table.
 * No email, no address, no date of birth, no payment details.
 */
export const reservationSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(60, "Name is too long."),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, "").replace(/^(\+91|0)/, ""))
    .pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number.")),
  date: z.iso.date({ error: "Choose a date." }).refine((d) => {
    const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    today.setHours(0, 0, 0, 0);
    const chosen = new Date(d + "T00:00:00");
    const max = new Date(today);
    max.setDate(max.getDate() + 60);
    return chosen >= today && chosen <= max;
  }, "Choose a date between today and 60 days from now."),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Choose a time.")
    .refine((t) => t >= "12:00" && t <= "22:30", "We take bookings from 12:00 PM to 10:30 PM."),
  guests: z.coerce.number().int().min(1, "At least 1 guest.").max(20, "For groups over 20, please call us."),
  notes: z.string().trim().max(300, "Keep notes under 300 characters.").optional().default(""),
  consent: z.literal("on", { error: "Please agree so we can contact you about this booking." }),
});

export type ReservationInput = z.infer<typeof reservationSchema>;

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<keyof ReservationInput, string>>;
  values?: Partial<Record<string, string>>;
};
