import { requireAdmin } from "@/lib/admin/auth";
import { hasDatabase } from "@/lib/db";
import { adminGetMenu } from "@/lib/content/store";
import type { MenuCategory } from "@/lib/content/schema";
import { PageHeader } from "@/components/admin/PageHeader";
import { MenuEditor } from "@/components/admin/MenuEditor";

export const metadata = { title: "Menu" };

export default async function MenuPage() {
  await requireAdmin();
  let menu: MenuCategory[] = [];
  let failed = !hasDatabase();
  if (!failed) {
    try {
      menu = await adminGetMenu();
    } catch (err) {
      console.error("Loading menu failed:", err instanceof Error ? err.message : err);
      failed = true;
    }
  }
  return (
    <>
      <PageHeader
        title="Menu"
        description="Add, edit and reorder dishes. Mark a dish “Sold out” to hide it from the website until you switch it back."
      />
      {failed ? <p role="alert" className="text-danger">The menu can&apos;t be edited until the database is connected.</p> : <MenuEditor menu={menu} />}
    </>
  );
}
