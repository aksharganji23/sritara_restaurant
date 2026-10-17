"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import sharp from "sharp";
import { z } from "zod";
import {
  checkPassword,
  clearFailures,
  createSession,
  destroySession,
  loginBlocked,
  recordFailure,
  requireAdmin,
  adminConfigured,
} from "@/lib/admin/auth";
import { hasDatabase } from "@/lib/db";
import { menuItemSchema, sectionSchemas, type BookingStatus, type SectionKey } from "@/lib/content/schema";
import * as store from "@/lib/content/store";

export type AdminState = { ok?: boolean; message?: string; errors?: Record<string, string> };

const fieldErrors = (err: z.ZodError) => {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
};

const str = (fd: FormData, k: string) => (fd.get(k) ?? "").toString();
const bool = (fd: FormData, k: string) => fd.get(k) === "on";

/** Refresh the customer site (instantly) and the admin page that changed. */
function refresh(adminPath: string) {
  updateTag(store.CONTENT_TAG);
  revalidatePath(adminPath);
}

function dbError(err: unknown): AdminState {
  console.error("Admin save failed:", err instanceof Error ? err.message : err);
  return { ok: false, message: "Couldn't save — the database didn't respond. Please try again." };
}

/* ------------------------------------------------------------------ */
/*  Login                                                              */
/* ------------------------------------------------------------------ */

export async function login(_prev: AdminState, fd: FormData): Promise<AdminState> {
  if (!adminConfigured()) return { ok: false, message: "Admin isn't set up yet: set ADMIN_PASSWORD (10+ characters) on the server." };
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (loginBlocked(ip)) return { ok: false, message: "Too many wrong attempts. Wait 15 minutes and try again." };

  if (!checkPassword(str(fd, "password"))) {
    recordFailure(ip);
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return { ok: false, message: "That password isn't right." };
  }
  clearFailures(ip);
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

/* ------------------------------------------------------------------ */
/*  Settings                                                           */
/* ------------------------------------------------------------------ */

const BOOLEAN_FIELDS: Partial<Record<SectionKey, string[]>> = {
  details: ["dineIn", "takeaway", "delivery"],
  rating: ["show"],
  booking: ["enabled"],
};

const SECRET_FIELDS = ["telegramBotToken", "callmebotApiKey"] as const;

export async function saveSettings(_prev: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  if (!hasDatabase()) return { ok: false, message: "No database connected (DATABASE_URL is missing)." };

  const section = str(fd, "section") as SectionKey;
  const schema = sectionSchemas[section];
  if (!schema) return { ok: false, message: "Unknown settings section." };

  let input: Record<string, unknown>;
  if (section === "hours") {
    input = {
      days: Array.from({ length: 7 }, (_, i) => ({
        closed: bool(fd, `closed-${i}`),
        open: str(fd, `open-${i}`),
        close: str(fd, `close-${i}`),
      })),
    };
  } else {
    const bools = BOOLEAN_FIELDS[section] ?? [];
    const keys = Object.keys((schema as z.ZodObject).shape);
    input = Object.fromEntries(keys.map((k) => [k, bools.includes(k) ? bool(fd, k) : str(fd, k)]));
  }

  try {
    if (section === "alerts") {
      // Blank secret fields keep the saved value, unless "remove" is ticked.
      const current = (await store.adminGetSettings()).alerts;
      for (const k of SECRET_FIELDS) {
        if (bool(fd, `clear-${k}`)) input[k] = "";
        else if (!input[k]) input[k] = current[k];
      }
    }
    const parsed = schema.safeParse(input);
    if (!parsed.success) return { ok: false, message: "Please fix the highlighted fields.", errors: fieldErrors(parsed.error) };
    await store.saveSection(section, parsed.data as never);
  } catch (err) {
    return dbError(err);
  }
  refresh("/admin/settings");
  return { ok: true, message: "Saved. The website is updated." };
}

/* ------------------------------------------------------------------ */
/*  Menu                                                               */
/* ------------------------------------------------------------------ */

const categoryTitle = z.string().trim().min(1, "Give the section a name.").max(60);
const id = (fd: FormData, k = "id") => z.coerce.number().int().positive().parse(fd.get(k));

function readItem(fd: FormData) {
  return menuItemSchema.safeParse({
    name: str(fd, "name"),
    telugu: str(fd, "telugu"),
    description: str(fd, "description"),
    price: str(fd, "price"),
    veg: str(fd, "veg") === "veg",
    spice: str(fd, "spice") || "0",
    signature: bool(fd, "signature"),
    available: bool(fd, "available"),
  });
}

export async function addCategoryAction(_prev: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const title = categoryTitle.safeParse(str(fd, "title"));
  if (!title.success) return { ok: false, errors: { title: title.error.issues[0].message } };
  try {
    await store.addCategory(title.data);
  } catch (err) {
    return dbError(err);
  }
  refresh("/admin/menu");
  return { ok: true, message: `Added "${title.data}".` };
}

export async function updateCategoryAction(_prev: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const title = categoryTitle.safeParse(str(fd, "title"));
  if (!title.success) return { ok: false, errors: { title: title.error.issues[0].message } };
  try {
    await store.updateCategory(id(fd), title.data, bool(fd, "visible"));
  } catch (err) {
    return dbError(err);
  }
  refresh("/admin/menu");
  return { ok: true, message: "Section saved." };
}

export async function deleteCategoryAction(fd: FormData) {
  await requireAdmin();
  await store.deleteCategory(id(fd));
  refresh("/admin/menu");
}

export async function moveCategoryAction(fd: FormData) {
  await requireAdmin();
  await store.moveCategory(id(fd), str(fd, "dir") === "up" ? -1 : 1);
  refresh("/admin/menu");
}

export async function saveItemAction(_prev: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const parsed = readItem(fd);
  if (!parsed.success) return { ok: false, message: "Please fix the highlighted fields.", errors: fieldErrors(parsed.error) };
  try {
    const itemId = fd.get("id") ? id(fd) : null;
    const categoryId = id(fd, "categoryId");
    if (itemId) await store.updateItem(itemId, categoryId, parsed.data);
    else await store.addItem(categoryId, parsed.data);
  } catch (err) {
    return dbError(err);
  }
  refresh("/admin/menu");
  return { ok: true, message: `Saved "${parsed.data.name}".` };
}

export async function deleteItemAction(fd: FormData) {
  await requireAdmin();
  await store.deleteItem(id(fd));
  refresh("/admin/menu");
}

export async function moveItemAction(fd: FormData) {
  await requireAdmin();
  await store.moveItem(id(fd), str(fd, "dir") === "up" ? -1 : 1);
  refresh("/admin/menu");
}

/** Quick toggle from the list: mark a dish available / sold out. */
export async function toggleItemAction(fd: FormData) {
  await requireAdmin();
  const menu = await store.adminGetMenu();
  const item = menu.flatMap((c) => c.items).find((i) => i.id === id(fd));
  if (!item) return;
  const { id: itemId, categoryId, sort: _s, ...rest } = item;
  await store.updateItem(itemId, categoryId, { ...rest, available: !item.available });
  refresh("/admin/menu");
}

/* ------------------------------------------------------------------ */
/*  Photos                                                             */
/* ------------------------------------------------------------------ */

const photoText = z.object({
  title: z.string().trim().max(60),
  note: z.string().trim().max(80),
  alt: z.string().trim().min(10, "Describe the photo in at least a few words (for blind visitors).").max(200),
});
const MAX_UPLOAD = 10 * 1024 * 1024;
const photoId = (fd: FormData) => z.uuid().parse(str(fd, "id"));

export async function uploadPhotoAction(_prev: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const text = photoText.safeParse({ title: str(fd, "title"), note: str(fd, "note"), alt: str(fd, "alt") });
  const file = fd.get("file");
  const errors: Record<string, string> = text.success ? {} : fieldErrors(text.error);
  if (!(file instanceof File) || file.size === 0) errors.file = "Choose a photo to upload.";
  else if (file.size > MAX_UPLOAD) errors.file = "That photo is over 10 MB. Please choose a smaller one.";
  else if (!/^image\/(jpeg|png|webp|avif|heic|heif)$/.test(file.type)) errors.file = "Use a JPG, PNG, WebP or HEIC photo.";
  if (!text.success || Object.keys(errors).length) return { ok: false, message: "Please fix the highlighted fields.", errors };

  try {
    // Re-encode: strips location/camera data (EXIF), fixes rotation, and shrinks the file.
    const input = Buffer.from(await (file as File).arrayBuffer());
    const { data, info } = await sharp(input, { limitInputPixels: 60_000_000 })
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer({ resolveWithObject: true });
    await store.addPhoto({ ...text.data, mime: "image/webp", data, width: info.width, height: info.height });
  } catch (err) {
    console.error("Photo upload failed:", err instanceof Error ? err.message : err);
    return { ok: false, message: "Couldn't process that photo. Try a different JPG or PNG." };
  }
  refresh("/admin/photos");
  return { ok: true, message: "Photo added to the gallery." };
}

export async function updatePhotoAction(_prev: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const text = photoText.safeParse({ title: str(fd, "title"), note: str(fd, "note"), alt: str(fd, "alt") });
  if (!text.success) return { ok: false, message: "Please fix the highlighted fields.", errors: fieldErrors(text.error) };
  try {
    await store.updatePhoto(photoId(fd), text.data);
  } catch (err) {
    return dbError(err);
  }
  refresh("/admin/photos");
  return { ok: true, message: "Saved." };
}

export async function deletePhotoAction(fd: FormData) {
  await requireAdmin();
  await store.deletePhoto(photoId(fd));
  refresh("/admin/photos");
}

export async function movePhotoAction(fd: FormData) {
  await requireAdmin();
  await store.movePhoto(photoId(fd), str(fd, "dir") === "up" ? -1 : 1);
  refresh("/admin/photos");
}

/* ------------------------------------------------------------------ */
/*  Bookings                                                           */
/* ------------------------------------------------------------------ */

export async function setBookingStatusAction(fd: FormData) {
  await requireAdmin();
  const status = z.enum(["new", "confirmed", "cancelled"]).parse(str(fd, "status")) as BookingStatus;
  await store.setBookingStatus(id(fd), status);
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
}

export async function deleteBookingAction(fd: FormData) {
  await requireAdmin();
  await store.deleteBooking(id(fd));
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
}
