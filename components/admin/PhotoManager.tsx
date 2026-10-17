"use client";
/* eslint-disable @next/next/no-img-element -- admin previews of our own uploads */
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import type { Photo } from "@/lib/content/schema";
import { deletePhotoAction, movePhotoAction, updatePhotoAction, uploadPhotoAction } from "@/app/admin/actions";
import { ActionButton, AdminForm, Field, TextArea } from "./ui";

const ALT_HINT = "What a blind visitor should hear, e.g. “Plate of mutton bagara with a bowl of raita”. Required.";

export function PhotoManager({ photos }: { photos: Photo[] }) {
  return (
    <div className="space-y-8">
      <section aria-labelledby="upload-title" className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <h2 id="upload-title" className="text-lg font-bold text-cream">Upload a photo</h2>
        <p className="mt-1 text-sm text-muted">
          JPG, PNG, WebP or HEIC up to 10 MB. Photos are resized and the hidden location data is removed automatically.
          Only upload photos the restaurant owns or has permission to use.
        </p>
        <div className="mt-5">
                    <AdminForm action={uploadPhotoAction} submitLabel="Upload photo" resetOnSuccess className="space-y-4">
          <Field label="Photo" name="file" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" required className="[&_input]:py-2" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title" name="title" maxLength={60} hint="Shown on the photo, e.g. “Mutton Bagara”. Optional." />
              <Field label="Short note" name="note" maxLength={80} hint="Shown on hover, e.g. “Slow-cooked mutton”. Optional." />
            </div>
            <TextArea label="Description for screen readers (alt text)" name="alt" rows={2} maxLength={200} required hint={ALT_HINT} />
          </AdminForm>
        </div>
      </section>

      <section aria-labelledby="gallery-admin-title">
        <h2 id="gallery-admin-title" className="mb-1 text-lg font-bold text-cream">Gallery ({photos.length})</h2>
        <p className="mb-4 text-sm text-muted">
          {photos.length
            ? "The first photo is shown large. Use the arrows to change the order."
            : "No photos yet — the website is showing placeholder illustrations until you upload the first one."}
        </p>
        <ul className="grid gap-5 md:grid-cols-2">
          {photos.map((p, i) => (
            <li key={p.id} className="overflow-hidden rounded-2xl border border-line bg-surface">
              <div className="relative aspect-[4/3] bg-surface-2">
                <img src={p.src} alt={p.alt} className="size-full object-cover" loading="lazy" />
                {i === 0 && <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-xs font-bold text-gold-deep">Shown large</span>}
              </div>
              <div className="p-4">
                <div className="mb-4 flex flex-wrap gap-2">
                  {i > 0 && (
                    <ActionButton action={movePhotoAction} fields={{ id: p.id, dir: "up" }} srLabel={`Move photo ${p.title || i + 1} earlier`}>
                      <ArrowUp aria-hidden="true" className="size-4" />
                    </ActionButton>
                  )}
                  {i < photos.length - 1 && (
                    <ActionButton action={movePhotoAction} fields={{ id: p.id, dir: "down" }} srLabel={`Move photo ${p.title || i + 1} later`}>
                      <ArrowDown aria-hidden="true" className="size-4" />
                    </ActionButton>
                  )}
                  <ActionButton
                    action={deletePhotoAction}
                    fields={{ id: p.id }}
                    tone="danger"
                    label="Delete"
                    srLabel={`Delete photo ${p.title || i + 1}`}
                    confirmText="Delete this photo from the gallery?"
                  >
                    <Trash2 aria-hidden="true" className="size-4" />
                  </ActionButton>
                </div>
                <AdminForm action={updatePhotoAction} submitLabel="Save text" className="space-y-3">
                  <input type="hidden" name="id" value={p.id} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Title" name="title" defaultValue={p.title} maxLength={60} />
                    <Field label="Short note" name="note" defaultValue={p.note} maxLength={80} />
                  </div>
                  <TextArea label="Alt text" name="alt" rows={2} defaultValue={p.alt} maxLength={200} required />
                </AdminForm>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
