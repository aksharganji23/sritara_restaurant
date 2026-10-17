// Server-only: sends new-booking alerts to the restaurant's phone.
//
// Channels are configured in Admin → Settings → Booking alerts. Environment
// variables (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, CALLMEBOT_PHONE,
// CALLMEBOT_APIKEY, RESERVATION_WEBHOOK_URL) are used as a fallback.
import type { Settings } from "./content/schema";
import { formatTime } from "./content/hours";

type Alerts = Settings["alerts"];
type BookingAlert = { name: string; phone: string; date: string; time: string; guests: number; notes: string };
type Channel = { name: string; send: (b: BookingAlert, text: string) => Promise<void> };

const TIMEOUT = 8000;
const clean = (s: string) => s.replace(/[\u0000-\u001f\u007f]+/g, " ").trim();

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

export function bookingMessage(b: BookingAlert, restaurant: string) {
  const lines = [
    `🍽 NEW TABLE REQUEST — ${restaurant}`,
    "",
    `Name: ${clean(b.name)}`,
    `Phone: +91${b.phone}`,
    `Date: ${formatDate(b.date)}`,
    `Time: ${formatTime(b.time)}`,
    `Guests: ${b.guests}`,
  ];
  if (b.notes) lines.push(`Notes: ${clean(b.notes)}`);
  lines.push("", "⚠ Not confirmed yet — please call the guest to confirm.");
  return lines.join("\n");
}

function resolve(alerts: Alerts) {
  const env = process.env;
  const callmebotPhone = alerts.callmebotPhone ? `+91${alerts.callmebotPhone}` : env.CALLMEBOT_PHONE ?? "";
  return {
    telegramToken: alerts.telegramBotToken || env.TELEGRAM_BOT_TOKEN || "",
    telegramChat: alerts.telegramChatId || env.TELEGRAM_CHAT_ID || "",
    callmebotPhone,
    callmebotKey: alerts.callmebotApiKey || env.CALLMEBOT_APIKEY || "",
    webhook: env.RESERVATION_WEBHOOK_URL || "",
  };
}

function channelsFor(alerts: Alerts): Channel[] {
  const c = resolve(alerts);
  const list: Channel[] = [];

  if (c.telegramToken && c.telegramChat) {
    list.push({
      name: "Telegram",
      async send(_b, text) {
        const res = await fetch(`https://api.telegram.org/bot${c.telegramToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: c.telegramChat, text, disable_web_page_preview: true }),
          signal: AbortSignal.timeout(TIMEOUT),
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Telegram responded ${res.status}`);
      },
    });
  }

  if (c.callmebotPhone && c.callmebotKey) {
    list.push({
      name: "WhatsApp (CallMeBot)",
      async send(_b, text) {
        const url = new URL("https://api.callmebot.com/whatsapp.php");
        url.searchParams.set("phone", c.callmebotPhone);
        url.searchParams.set("text", text);
        url.searchParams.set("apikey", c.callmebotKey);
        const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT), cache: "no-store" });
        const body = await res.text();
        if (!res.ok || /error|invalid|not\s+activated/i.test(body)) throw new Error(`CallMeBot responded ${res.status}`);
      },
    });
  }

  if (c.webhook) {
    list.push({
      name: "Webhook",
      async send(b) {
        const res = await fetch(c.webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...b, submittedAt: new Date().toISOString() }),
          signal: AbortSignal.timeout(TIMEOUT),
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
      },
    });
  }
  return list;
}

/** Names of the channels that are switched on (shown in the Privacy Policy and admin). */
export const activeChannels = (alerts: Alerts) => channelsFor(alerts).map((c) => c.name);

/** Sends the alert on every configured channel at once. Never logs guest data or secrets. */
export async function notifyRestaurant(b: BookingAlert, alerts: Alerts, restaurant: string) {
  const channels = channelsFor(alerts);
  if (!channels.length) return { configured: 0, delivered: 0 };
  const text = bookingMessage(b, restaurant);
  const results = await Promise.allSettled(channels.map((c) => c.send(b, text)));
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(`Booking alert via ${channels[i].name} failed: ${r.reason instanceof Error ? r.reason.message : "unknown error"}`);
    }
  });
  return { configured: channels.length, delivered: results.filter((r) => r.status === "fulfilled").length };
}
