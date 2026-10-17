"use client";
import Link from "next/link";
import { useActionState, useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { reserve } from "@/app/actions/reserve";
import type { FormState } from "@/lib/reservation-schema";

const initial: FormState = { status: "idle" };

const labels: Record<string, string> = {
  name: "Full name", phone: "Mobile number", date: "Date", time: "Time", guests: "Number of guests", notes: "Notes", consent: "Consent",
};

type Props = { name: string; phoneDisplay: string; phoneE164: string; maxGuests: number; maxDaysAhead: number };

/** Today's date in India as YYYY-MM-DD (so late-night visitors don't see yesterday). */
const indiaDate = (offsetDays = 0) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date(Date.now() + offsetDays * 86_400_000));

export function ReserveForm({ name, phoneDisplay, phoneE164, maxGuests, maxDaysAhead }: Props) {
  const site = { name, phoneDisplay, phoneE164 };
  const [state, action, pending] = useActionState(reserve, initial);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const e = state.errors ?? {};
  const v = state.values ?? {};

  // Move focus to the error summary / success message so keyboard and screen-reader users hear the result.
  useEffect(() => {
    if (state.status === "error") summaryRef.current?.focus();
    if (state.status === "success") successRef.current?.focus();
  }, [state]);

  const today = indiaDate();
  const lastDay = indiaDate(maxDaysAhead);

  if (state.status === "success") {
    return (
      <motion.div
        ref={successRef}
        tabIndex={-1}
        role="status"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-leaf/50 bg-surface p-10 text-center"
      >
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.15 }} className="inline-block">
          <CheckCircle2 aria-hidden="true" className="mx-auto size-14 text-leaf" />
        </motion.span>
        <p className="mt-4 font-display text-2xl text-cream">Request received</p>
        <p className="mt-2 text-muted">{state.message}</p>
      </motion.div>
    );
  }

  const field = (name: string) => ({
    id: `${uid}-${name}`,
    name,
    "aria-invalid": e[name as keyof typeof e] ? true : undefined,
    "aria-describedby": e[name as keyof typeof e] ? `${uid}-${name}-err` : undefined,
  });

  const input =
    "mt-2 w-full rounded-xl border border-field bg-surface-2 px-4 py-3 text-cream placeholder:text-muted transition-colors focus:border-gold aria-[invalid=true]:border-danger";

  const Err = ({ name }: { name: keyof NonNullable<FormState["errors"]> }) =>
    e[name] ? (
      <p id={`${uid}-${name}-err`} className="mt-1.5 flex items-center gap-1.5 text-sm text-danger">
        <AlertCircle aria-hidden="true" className="size-4" /> {e[name]}
      </p>
    ) : null;

  return (
    <form key={JSON.stringify(v)} action={action} noValidate className="rounded-3xl border border-line/70 bg-surface p-6 sm:p-10">
      <AnimatePresence>
        {state.status === "error" && (
          <motion.div
            ref={summaryRef}
            tabIndex={-1}
            role="alert"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border border-danger/60 bg-danger/10 p-4"
          >
            <p className="font-bold text-cream">{state.message}</p>
            {Object.keys(e).length > 0 && (
              <ul className="mt-2 list-disc pl-5 text-sm">
                {Object.entries(e).map(([k, msg]) => (
                  <li key={k}>
                    <a href={`#${uid}-${k}`} className="text-danger underline underline-offset-2">{labels[k]}: {msg}</a>
                  </li>
                ))}
              </ul>
            )}
            {!Object.keys(e).length && (
              <a href={`tel:${site.phoneE164}`} className="mt-2 inline-block font-bold text-gold underline">Call {site.phoneDisplay}</a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mb-6 text-sm text-muted">Fields marked <span aria-hidden="true">*</span><span className="sr-only">with an asterisk</span> are required.</p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-name`} className="font-semibold text-cream">Full name <span aria-hidden="true" className="text-gold">*</span></label>
          <input {...field("name")} type="text" autoComplete="name" required maxLength={60} defaultValue={v.name} className={input} />
          <Err name="name" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-phone`} className="font-semibold text-cream">Mobile number <span aria-hidden="true" className="text-gold">*</span></label>
          <p id={`${uid}-phone-hint`} className="text-sm text-muted">We only use this to confirm your booking.</p>
          <input
            {...field("phone")}
            aria-describedby={[`${uid}-phone-hint`, e.phone && `${uid}-phone-err`].filter(Boolean).join(" ")}
            type="tel" inputMode="tel" autoComplete="tel-national" required placeholder="98765 43210" defaultValue={v.phone} className={input}
          />
          <Err name="phone" />
        </div>
        <div>
          <label htmlFor={`${uid}-date`} className="font-semibold text-cream">Date <span aria-hidden="true" className="text-gold">*</span></label>
          <input {...field("date")} type="date" min={today} max={lastDay} required defaultValue={v.date} className={`${input} [color-scheme:dark]`} />
          <Err name="date" />
        </div>
        <div>
          <label htmlFor={`${uid}-time`} className="font-semibold text-cream">Time <span aria-hidden="true" className="text-gold">*</span></label>
          <input {...field("time")} type="time" step={900} required defaultValue={v.time} className={`${input} [color-scheme:dark]`} />
          <Err name="time" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-guests`} className="font-semibold text-cream">Number of guests <span aria-hidden="true" className="text-gold">*</span></label>
          <select {...field("guests")} required defaultValue={v.guests ?? "2"} className={input}>
            {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
            ))}
          </select>
          <Err name="guests" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-notes`} className="font-semibold text-cream">Notes <span className="font-normal text-muted">(optional)</span></label>
          <p id={`${uid}-notes-hint`} className="text-sm text-muted">E.g. high chair, birthday. Please don&apos;t include health details.</p>
          <textarea
            {...field("notes")}
            aria-describedby={[`${uid}-notes-hint`, e.notes && `${uid}-notes-err`].filter(Boolean).join(" ")}
            rows={3} maxLength={300} defaultValue={v.notes} className={input}
          />
          <Err name="notes" />
        </div>

        {/* Honeypot — hidden from people and assistive tech */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor={`${uid}-company`}>Company</label>
          <input id={`${uid}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-start gap-3">
            <input
              {...field("consent")}
              type="checkbox"
              required
              className="mt-1 size-5 shrink-0 cursor-pointer accent-[#e9b44c]"
            />
            <label htmlFor={`${uid}-consent`} className="text-muted">
              I agree that {site.name} may use my name and number to confirm this booking, as described in the{" "}
              <Link href="/privacy-policy" className="text-gold underline underline-offset-4">Privacy Policy</Link>.{" "}
              <span aria-hidden="true" className="text-gold">*</span>
            </label>
          </div>
          <Err name="consent" />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        aria-disabled={pending}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-lg font-bold text-gold-deep transition-transform hover:scale-[1.02] disabled:cursor-wait disabled:opacity-80 sm:w-auto"
      >
        {pending ? (<><Loader2 aria-hidden="true" className="size-5 animate-spin" /> Sending request…</>) : "Request a table"}
      </button>
      <p className="mt-4 text-sm text-muted">
        This sends a request — your table is confirmed only when we call you back. Prefer to talk?{" "}
        <a href={`tel:${site.phoneE164}`} className="text-gold underline underline-offset-4">Call {site.phoneDisplay}</a>
      </p>
    </form>
  );
}
