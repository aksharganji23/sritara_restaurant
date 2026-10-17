"use client";
import { useId } from "react";
import { DAYS, type Settings } from "@/lib/content/schema";
import { saveSettings } from "@/app/admin/actions";
import { AdminForm, Checkbox, Field, TextArea } from "./ui";

type PublicAlerts = { telegramChatId: string; callmebotPhone: string; hasTelegramToken: boolean; hasCallmebotKey: boolean };
type Props = { settings: Omit<Settings, "alerts">; alerts: PublicAlerts; activeChannels: string[] };

function Section({ id, title, description, children }: { id: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-6 rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <h2 id={`${id}-title`} className="text-lg font-bold text-cream">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

const Hidden = ({ section }: { section: string }) => <input type="hidden" name="section" value={section} />;

function HoursRow({ i, day }: { i: number; day: Settings["hours"]["days"][number] }) {
  const id = useId();
  const name = DAYS[i];
  return (
    <fieldset className="grid grid-cols-[1fr_auto] items-end gap-3 border-b border-line py-3 last:border-0 sm:grid-cols-[9rem_1fr_1fr_auto]">
      <legend className="sr-only">{name}</legend>
      <span aria-hidden="true" className="col-span-2 font-semibold text-cream sm:col-span-1 sm:self-center">{name}</span>
      <div>
        <label htmlFor={`${id}-o`} className="text-xs text-muted">Opens</label>
        <input id={`${id}-o`} name={`open-${i}`} type="time" defaultValue={day.open} required className="mt-1 w-full rounded-lg border border-field bg-surface-2 px-3 py-2 text-cream [color-scheme:dark]" />
      </div>
      <div>
        <label htmlFor={`${id}-c`} className="text-xs text-muted">Closes</label>
        <input id={`${id}-c`} name={`close-${i}`} type="time" defaultValue={day.close} required className="mt-1 w-full rounded-lg border border-field bg-surface-2 px-3 py-2 text-cream [color-scheme:dark]" />
      </div>
      <div className="col-span-2 flex items-center gap-2 sm:col-span-1 sm:pb-2">
        <input id={`${id}-x`} name={`closed-${i}`} type="checkbox" defaultChecked={day.closed} className="size-5 accent-[#e9b44c]" />
        <label htmlFor={`${id}-x`} className="text-sm text-cream">Closed all day</label>
      </div>
    </fieldset>
  );
}

export function SettingsForms({ settings: s, alerts, activeChannels }: Props) {
  return (
    <div className="space-y-6">
      <nav aria-label="Settings sections" className="flex flex-wrap gap-2 text-sm">
        {[
          ["details", "Restaurant details"],
          ["contact", "Contact & location"],
          ["hours", "Opening hours"],
          ["booking", "Table bookings"],
          ["alerts", "Booking alerts"],
          ["rating", "Rating"],
          ["legal", "Legal"],
        ].map(([id, label]) => (
          <a key={id} href={`#${id}`} className="rounded-lg border border-field px-3 py-1.5 text-cream hover:border-gold">{label}</a>
        ))}
      </nav>

      <Section id="details" title="Restaurant details" description="Names and the main text on the home page.">
        <AdminForm action={saveSettings} className="space-y-4">
          <Hidden section="details" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Short name" name="name" required defaultValue={s.details.name} maxLength={60} hint="Used in the header, e.g. “Sritara Classic”" />
            <Field label="Full name" name="fullName" required defaultValue={s.details.fullName} maxLength={120} />
            <Field label="Name in Telugu" name="teluguName" defaultValue={s.details.teluguName} maxLength={160} lang="te" />
            <Field label="Tagline" name="tagline" defaultValue={s.details.tagline} maxLength={160} hint="Used for Google search results" />
          </div>
          <Field
            label="Announcement bar"
            name="announcement"
            defaultValue={s.details.announcement}
            maxLength={200}
            hint="Shown at the very top of every page, e.g. “Closed on 1 Nov for Diwali”. Leave empty to hide."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Home page headline" name="heroTitle" required defaultValue={s.details.heroTitle} maxLength={80} />
            <Field label="Word to highlight in gold" name="heroHighlight" defaultValue={s.details.heroHighlight} maxLength={40} hint="Must match one word of the headline exactly" />
          </div>
          <TextArea label="Home page intro" name="heroText" rows={3} defaultValue={s.details.heroText} maxLength={400} />
          <Field label="“Our story” heading" name="aboutTitle" defaultValue={s.details.aboutTitle} maxLength={100} />
          <TextArea label="“Our story” text" name="aboutText" rows={6} defaultValue={s.details.aboutText} maxLength={2000} hint="Leave a blank line between paragraphs." />
          <Field label="Price range" name="priceRange" defaultValue={s.details.priceRange} maxLength={60} hint="e.g. ₹200–400 per person" />
          <fieldset>
            <legend className="text-sm font-semibold text-cream">Services offered</legend>
            <div className="mt-2 flex flex-wrap gap-6">
              <Checkbox label="Dine-in" name="dineIn" defaultChecked={s.details.dineIn} />
              <Checkbox label="Takeaway" name="takeaway" defaultChecked={s.details.takeaway} />
              <Checkbox label="Delivery" name="delivery" defaultChecked={s.details.delivery} />
            </div>
          </fieldset>
        </AdminForm>
      </Section>

      <Section id="contact" title="Contact & location" description="Every phone number, WhatsApp link, address and map on the website comes from here.">
        <AdminForm action={saveSettings} className="space-y-4">
          <Hidden section="contact" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone number" name="phone" type="tel" inputMode="tel" required defaultValue={s.contact.phone} hint="10-digit mobile. Used for every “Call” button." />
            <Field label="WhatsApp number" name="whatsapp" type="tel" inputMode="tel" defaultValue={s.contact.whatsapp} hint="Leave empty to hide WhatsApp links." />
            <Field label="Email" name="email" type="email" defaultValue={s.contact.email} hint="Optional" className="sm:col-span-2" />
            <Field label="Street" name="street" required defaultValue={s.contact.street} maxLength={160} className="sm:col-span-2" />
            <Field label="City / town" name="city" required defaultValue={s.contact.city} />
            <Field label="State" name="state" required defaultValue={s.contact.state} />
            <Field label="PIN code" name="postalCode" required inputMode="numeric" defaultValue={s.contact.postalCode} />
          </div>
          <fieldset className="rounded-xl border border-line p-4">
            <legend className="px-1 text-sm font-semibold text-cream">Map pin</legend>
            <p className="text-xs text-muted">
              In Google Maps, right-click exactly on the restaurant (long-press on a phone) and click the numbers at the top
              to copy them. Paste the first number into Latitude and the second into Longitude.
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <Field label="Latitude" name="lat" required inputMode="decimal" defaultValue={s.contact.lat} />
              <Field label="Longitude" name="lng" required inputMode="decimal" defaultValue={s.contact.lng} />
              <Field label="Map zoom" name="zoom" type="number" min={10} max={20} required defaultValue={s.contact.zoom} hint="17 = street level" />
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${s.contact.lat},${s.contact.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-gold underline underline-offset-4"
            >
              Check the saved pin on Google Maps<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </fieldset>
        </AdminForm>
      </Section>

      <Section id="hours" title="Opening hours" description="Used for the “Open now” badge, the hours on the site, Google search data and which booking times are allowed. If you close after midnight, enter e.g. Opens 18:00, Closes 01:00.">
        <AdminForm action={saveSettings}>
          <Hidden section="hours" />
          {s.hours.days.map((d, i) => (
            <HoursRow key={i} i={i} day={d} />
          ))}
        </AdminForm>
      </Section>

      <Section id="booking" title="Table bookings" description="Rules for the booking form on the website.">
        <AdminForm action={saveSettings} className="space-y-4">
          <Hidden section="booking" />
          <Checkbox label="Accept booking requests online" name="enabled" defaultChecked={s.booking.enabled} hint="Untick to show “Book by phone” instead of the form" />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Largest party" name="maxGuests" type="number" min={1} max={200} required defaultValue={s.booking.maxGuests} hint="Bigger groups are asked to call" />
            <Field label="Days ahead" name="maxDaysAhead" type="number" min={1} max={365} required defaultValue={s.booking.maxDaysAhead} hint="How far in advance guests can book" />
            <Field label="Last booking before closing (minutes)" name="lastSeatingMinutes" type="number" min={0} max={240} required defaultValue={s.booking.lastSeatingMinutes} />
          </div>
        </AdminForm>
      </Section>

      <Section id="alerts" title="Booking alerts" description="Where new table requests are sent, as well as appearing in Bookings.">
        <p className={`mb-5 rounded-lg p-3 text-sm ${activeChannels.length ? "bg-leaf/10 text-leaf" : "bg-danger/10 text-danger"}`} role="status">
          {activeChannels.length ? `Active now: ${activeChannels.join(", ")}` : "No alerts active — you'll only see bookings in this admin."}
        </p>
        <AdminForm action={saveSettings} className="space-y-6">
          <Hidden section="alerts" />
          <fieldset className="space-y-4 rounded-xl border border-line p-4">
            <legend className="px-1 font-semibold text-cream">WhatsApp (CallMeBot)</legend>
            <p className="text-xs text-muted">
              From the WhatsApp of the number below, send <q>I allow callmebot to send me messages</q> to +34 644 31 95 65. Paste the
              key it replies with. Free service for personal use; not official WhatsApp.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Phone that receives alerts" name="callmebotPhone" type="tel" inputMode="tel" defaultValue={alerts.callmebotPhone} hint="10-digit mobile" />
              <Field
                label="CallMeBot API key"
                name="callmebotApiKey"
                type="password"
                autoComplete="off"
                placeholder={alerts.hasCallmebotKey ? "Saved — leave empty to keep" : ""}
                hint={alerts.hasCallmebotKey ? "A key is saved." : "No key saved yet."}
              />
            </div>
            {alerts.hasCallmebotKey && <Checkbox label="Remove the saved CallMeBot key" name="clear-callmebotApiKey" />}
          </fieldset>

          <fieldset className="space-y-4 rounded-xl border border-line p-4">
            <legend className="px-1 font-semibold text-cream">Telegram (recommended)</legend>
            <p className="text-xs text-muted">Create a bot with @BotFather, press Start in it, then find your chat ID (see README).</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Chat ID" name="telegramChatId" defaultValue={alerts.telegramChatId} inputMode="numeric" />
              <Field
                label="Bot token"
                name="telegramBotToken"
                type="password"
                autoComplete="off"
                placeholder={alerts.hasTelegramToken ? "Saved — leave empty to keep" : ""}
                hint={alerts.hasTelegramToken ? "A token is saved." : "No token saved yet."}
              />
            </div>
            {alerts.hasTelegramToken && <Checkbox label="Remove the saved Telegram token" name="clear-telegramBotToken" />}
          </fieldset>
        </AdminForm>
      </Section>

      <Section id="rating" title="Google rating" description="Shown on the home page. Keep it matching your real Google rating.">
        <AdminForm action={saveSettings} className="space-y-4">
          <Hidden section="rating" />
          <Checkbox label="Show the rating on the website" name="show" defaultChecked={s.rating.show} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Rating (out of 5)" name="value" type="number" step="0.1" min={0} max={5} required defaultValue={s.rating.value} />
            <Field label="Number of reviews" name="count" type="number" min={0} required defaultValue={s.rating.count} />
          </div>
          <Field label="Link to your Google reviews" name="reviewsUrl" type="url" defaultValue={s.rating.reviewsUrl} hint="In Google Maps, open the restaurant → Share → Copy link" />
        </AdminForm>
      </Section>

      <Section id="legal" title="Legal details" description="Shown in the footer and on the legal pages.">
        <AdminForm action={saveSettings} className="space-y-4">
          <Hidden section="legal" />
          <Field label="Registered business name" name="entity" required defaultValue={s.legal.entity} maxLength={160} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="FSSAI licence number" name="fssai" defaultValue={s.legal.fssai} maxLength={40} />
            <Field label="GSTIN" name="gstin" defaultValue={s.legal.gstin} maxLength={20} />
            <Field label="Grievance Officer name" name="grievanceOfficer" defaultValue={s.legal.grievanceOfficer} maxLength={100} hint="Person customers can contact about their data" />
          </div>
        </AdminForm>
      </Section>
    </div>
  );
}
