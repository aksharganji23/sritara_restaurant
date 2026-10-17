import { requireAdmin } from "@/lib/admin/auth";
import { hasDatabase } from "@/lib/db";
import { adminGetSettings } from "@/lib/content/store";
import { activeChannels } from "@/lib/notify";
import { PageHeader } from "@/components/admin/PageHeader";
import { SettingsForms } from "@/components/admin/SettingsForms";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireAdmin();
  if (!hasDatabase()) {
    return (
      <>
        <PageHeader title="Settings" />
        <p role="alert" className="text-danger">Settings can&apos;t be changed until the database is connected.</p>
      </>
    );
  }
  let settings;
  try {
    settings = await adminGetSettings();
  } catch (err) {
    console.error("Loading settings failed:", err instanceof Error ? err.message : err);
    return (
      <>
        <PageHeader title="Settings" />
        <p role="alert" className="text-danger">Couldn&apos;t load settings — the database didn&apos;t respond.</p>
      </>
    );
  }

  // Secrets (tokens/keys) never leave the server; the form only learns whether one is saved.
  const { alerts, ...rest } = settings;
  const publicAlerts = {
    telegramChatId: alerts.telegramChatId,
    callmebotPhone: alerts.callmebotPhone,
    hasTelegramToken: Boolean(alerts.telegramBotToken),
    hasCallmebotKey: Boolean(alerts.callmebotApiKey),
  };

  return (
    <>
      <PageHeader title="Settings" description="Change any detail and press Save in that section. The website updates immediately." />
      <SettingsForms settings={rest} alerts={publicAlerts} activeChannels={activeChannels(alerts)} />
    </>
  );
}
