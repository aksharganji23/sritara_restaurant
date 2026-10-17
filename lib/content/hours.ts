// Pure helpers for opening hours — safe to use on both server and browser.
import { DAYS } from "./schema";

export type DayHours = { closed: boolean; open: string; close: string };

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

/** Day index with Monday = 0, and minutes since midnight, in India time. */
export function nowInIndia(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = DAYS.indexOf(get("weekday") as (typeof DAYS)[number]);
  return { day, minutes: (Number(get("hour")) % 24) * 60 + Number(get("minute")) };
}

/** True if open at the given India-time moment. Handles closing after midnight (e.g. 18:00–01:00). */
export function isOpen(week: DayHours[], at = new Date()) {
  const { day, minutes } = nowInIndia(at);
  const today = week[day];
  const yesterday = week[(day + 6) % 7];
  if (today && !today.closed) {
    const o = toMin(today.open);
    const c = toMin(today.close);
    if (c > o ? minutes >= o && minutes < c : minutes >= o) return true;
  }
  if (yesterday && !yesterday.closed) {
    const o = toMin(yesterday.open);
    const c = toMin(yesterday.close);
    if (c <= o && minutes < c) return true;
  }
  return false;
}

/** Groups consecutive days with identical hours: "Monday – Friday: 12:00 PM – 11:00 PM". */
export function hoursSummary(week: DayHours[]) {
  const label = (d: DayHours) => (d.closed ? "Closed" : `${formatTime(d.open)} – ${formatTime(d.close)}`);
  const rows: { days: string; time: string }[] = [];
  let start = 0;
  for (let i = 1; i <= 7; i++) {
    if (i === 7 || label(week[i]) !== label(week[start])) {
      rows.push({ days: i - 1 === start ? DAYS[start] : `${DAYS[start]} – ${DAYS[i - 1]}`, time: label(week[start]) });
      start = i;
    }
  }
  return rows;
}

/**
 * Checks a requested booking time against that day's hours.
 * Returns an error message, or null if it's fine.
 */
export function checkBookingTime(week: DayHours[], dateIso: string, time: string, lastSeatingMinutes: number) {
  const jsDay = new Date(`${dateIso}T00:00:00Z`).getUTCDay(); // 0 = Sunday
  const d = week[(jsDay + 6) % 7];
  if (!d || d.closed) return `We're closed on ${DAYS[(jsDay + 6) % 7]}s. Please choose another day.`;
  const o = toMin(d.open);
  let c = toMin(d.close);
  if (c <= o) c += 24 * 60;
  let t = toMin(time);
  if (t < o && t + 24 * 60 < c) t += 24 * 60;
  const last = c - lastSeatingMinutes;
  if (t < o || t > last) {
    const lastLabel = formatTime(`${String(Math.floor((last % 1440) / 60)).padStart(2, "0")}:${String(last % 60).padStart(2, "0")}`);
    return `That day we take bookings from ${formatTime(d.open)} to ${lastLabel}.`;
  }
  return null;
}
