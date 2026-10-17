import Link from "next/link";
import { CalendarCheck, Image as ImageIcon, UtensilsCrossed, BellRing } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { hasDatabase } from "@/lib/db";
import { adminGetMenu, adminGetPhotos, adminGetSettings, bookingStats } from "@/lib/content/store";
import { defaultSettings } from "@/lib/content/defaults";
import { activeChannels } from "@/lib/notify";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { AutoRefresh } from "@/components/admin/AutoRefresh";

export const metadata = { title: "Dashboard" };

export default async function Dashboard() {
  await requireAdmin();

  let stats = { pending: 0, today: 0, upcoming: 0 };
  let dishes = 0;
  let soldOut = 0;
  let photos = 0;
  let settings = defaultSettings;
  let dbOk = hasDatabase();
  if (dbOk) {
    try {
      const [s, menu, p, st] = await Promise.all([bookingStats(), adminGetMenu(), adminGetPhotos(), adminGetSettings()]);
      stats = s;
      const items = menu.flatMap((c) => c.items);
      dishes = items.length;
      soldOut = items.filter((i) => !i.available).length;
      photos = p.length;
      settings = st;
    } catch (err) {
      console.error("Dashboard load failed:", err instanceof Error ? err.message : err);
      dbOk = false;
    }
  }
  const channels = activeChannels(settings.alerts);

  const tiles = [
    { label: "Requests to confirm", value: stats.pending, href: "/admin/bookings", icon: CalendarCheck, highlight: stats.pending > 0 },
    { label: "Bookings today", value: stats.today, href: "/admin/bookings", icon: CalendarCheck },
    { label: "Dishes on the menu", value: dishes, sub: soldOut ? `${soldOut} marked sold out` : undefined, href: "/admin/menu", icon: UtensilsCrossed },
    { label: "Gallery photos", value: photos, sub: photos ? undefined : "Showing placeholders", href: "/admin/photos", icon: ImageIcon },
  ];

  return (
    <>
      <PageHeader title="Dashboard" description="Everything you change here appears on the website straight away." />
            <AutoRefresh pending={stats.pending} />

      {hasDatabase() && !dbOk && (
        <p role="alert" className="mb-6 rounded-xl border border-danger/60 bg-danger/10 p-4 text-sm text-cream">
          The database didn&apos;t respond. Check DATABASE_URL and that your Neon project is active.
        </p>
      )}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <li key={t.label}>
            <Link
              href={t.href}
              className={`flex h-full flex-col rounded-2xl border p-5 transition-colors hover:border-gold ${
                t.highlight ? "border-gold bg-gold/10" : "border-line bg-surface"
              }`}
            >
              <t.icon aria-hidden="true" className="size-5 text-gold" />
              <span className="mt-3 font-display text-4xl text-cream">{t.value}</span>
              <span className="mt-1 text-sm text-muted">{t.label}</span>
              {t.sub && <span className="mt-1 text-xs text-muted">{t.sub}</span>}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card title="Booking alerts" id="alerts-status">
          <div className="flex items-start gap-3">
            <BellRing aria-hidden="true" className={`mt-0.5 size-5 ${channels.length ? "text-leaf" : "text-danger"}`} />
            <p className="text-muted">
              {channels.length ? (
                <>New table requests are sent to your phone by <strong className="text-cream">{channels.join(" and ")}</strong>.</>
              ) : (
                <>No alerts are set up, so you&apos;ll only see bookings here. Set up WhatsApp or Telegram alerts in Settings.</>
              )}
            </p>
          </div>
          <Link href="/admin/settings#alerts" className="mt-4 inline-block text-gold underline underline-offset-4">Alert settings</Link>
        </Card>
        <Card title="Quick links" id="quick">
          <ul className="space-y-2">
            <li><Link className="text-gold underline underline-offset-4" href="/admin/settings#contact">Change phone, WhatsApp or address</Link></li>
            <li><Link className="text-gold underline underline-offset-4" href="/admin/settings#hours">Change opening hours</Link></li>
            <li><Link className="text-gold underline underline-offset-4" href="/admin/settings#details">Post an announcement (e.g. holiday closure)</Link></li>
            <li><Link className="text-gold underline underline-offset-4" href="/admin/menu">Mark a dish sold out</Link></li>
          </ul>
        </Card>
      </div>
    </>
  );
}
