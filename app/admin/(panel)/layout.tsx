import { requireAdmin } from "@/lib/admin/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { hasDatabase } from "@/lib/db";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[16rem_1fr]">
      <AdminNav />
      <main id="main" tabIndex={-1} className="min-w-0 px-5 py-8 outline-none sm:px-8 lg:py-10">
        {!hasDatabase() && (
          <div role="alert" className="mb-8 rounded-xl border border-danger/60 bg-danger/10 p-4 text-sm text-cream">
            <strong>No database connected.</strong> The site is showing built-in default content and nothing can be saved.
            Add <code className="text-gold">DATABASE_URL</code> from Neon (see README → Admin setup), then restart.
          </div>
        )}
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
