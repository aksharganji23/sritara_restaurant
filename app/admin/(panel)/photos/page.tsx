import { requireAdmin } from "@/lib/admin/auth";
import { hasDatabase } from "@/lib/db";
import { adminGetPhotos } from "@/lib/content/store";
import type { Photo } from "@/lib/content/schema";
import { PageHeader } from "@/components/admin/PageHeader";
import { PhotoManager } from "@/components/admin/PhotoManager";

export const metadata = { title: "Photos" };

export default async function PhotosPage() {
  await requireAdmin();
  let photos: Photo[] = [];
  let failed = !hasDatabase();
  if (!failed) {
    try {
      photos = await adminGetPhotos();
    } catch (err) {
      console.error("Loading photos failed:", err instanceof Error ? err.message : err);
      failed = true;
    }
  }
  return (
    <>
      <PageHeader title="Photos" description="The gallery on the home page. Good food photos make the biggest difference to a restaurant website." />
      {failed ? <p role="alert" className="text-danger">Photos can&apos;t be managed until the database is connected.</p> : <PhotoManager photos={photos} />}
    </>
  );
}
