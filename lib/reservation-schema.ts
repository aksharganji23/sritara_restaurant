import { z } from "zod";

/**
 * Data minimisation: only what's needed to hold a table.
 * Day-specific rules (opening hours, max guests, how far ahead) come from the
 * admin settings and are checked in app/actions/reserve.ts.
 */
export const reservationSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(60, "Name is too long."),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, "").replace(/^(\+91|0)/, ""))
    .pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number.")),
  date: z.iso.date({ error: "Choose a date." }),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Choose a time."),
  guests: z.coerce.number().int().min(1, "At least 1 guest.").max(200),
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
