// Server-only: reads and writes site content in the database.
import { unstable_cache } from "next/cache";
import { dbReady, getSql, hasDatabase } from "../db";
import { defaultSettings, fallbackMenu, placeholderPhotos } from "./defaults";
import {
  sectionSchemas,
  type Booking,
  type BookingStatus,
  type MenuCategory,
  type MenuItem,
  type Photo,
  type SectionKey,
  type Settings,
} from "./schema";

export const CONTENT_TAG = "site-content";

/* ------------------------------------------------------------------ */
/*  Reading                                                            */
/* ------------------------------------------------------------------ */

async function readSettings(): Promise<Settings> {
  const sql = getSql();
  const rows = await sql<{ key: string; value: unknown }[]>`SELECT key, value FROM settings`;
  const stored = new Map(rows.map((r) => [r.key, r.value]));
  const out = { ...defaultSettings } as Record<SectionKey, unknown>;
  for (const key of Object.keys(sectionSchemas) as SectionKey[]) {
    if (!stored.has(key)) continue;
    // Merge over defaults so newly-added fields always have a value.
    const merged = { ...(defaultSettings[key] as object), ...(stored.get(key) as object) };
    const parsed = sectionSchemas[key].safeParse(merged);
    if (parsed.success) out[key] = parsed.data;
    else console.error(`Stored settings "${key}" are invalid; using defaults.`);
  }
  return out as Settings;
}

async function readMenu(includeHidden: boolean): Promise<MenuCategory[]> {
  const sql = getSql();
  const cats = await sql<{ id: number; title: string; sort: number; visible: boolean }[]>`
    SELECT id, title, sort, visible FROM menu_categories ORDER BY sort, id`;
  const items = await sql`
    SELECT id, category_id, name, telugu, description, price, veg, spice, signature, available, sort
    FROM menu_items ORDER BY sort, id`;
  return cats
    .filter((c) => includeHidden || c.visible)
    .map((c) => ({
      ...c,
      items: items
        .filter((i) => i.category_id === c.id && (includeHidden || i.available))
        .map(
          (i): MenuItem => ({
            id: i.id,
            categoryId: i.category_id,
            name: i.name,
            telugu: i.telugu,
            description: i.description,
            price: i.price,
            veg: i.veg,
            spice: i.spice,
            signature: i.signature,
            available: i.available,
            sort: i.sort,
          }),
        ),
    }))
    .filter((c) => includeHidden || c.items.length > 0);
}

async function readPhotos(): Promise<Photo[]> {
  const sql = getSql();
  const rows = await sql<{ id: string; title: string; note: string; alt: string; sort: number }[]>`
    SELECT id, title, note, alt, sort FROM photos ORDER BY sort, created_at`;
  return rows.map((r) => ({ ...r, src: `/media/${r.id}` }));
}

const cachedContent = unstable_cache(
  async () => {
    await dbReady();
    const [settings, menu, photos] = await Promise.all([readSettings(), readMenu(false), readPhotos()]);
    return { settings, menu, photos: photos.length ? photos : placeholderPhotos };
  },
  ["site-content-v1"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);

export type SiteContent = { settings: Settings; menu: MenuCategory[]; photos: Photo[]; source: "database" | "defaults" };

/** Everything the customer site needs. Falls back to defaults if the DB is missing or down. */
export async function getSiteContent(): Promise<SiteContent> {
  if (!hasDatabase()) return { settings: defaultSettings, menu: fallbackMenu, photos: placeholderPhotos, source: "defaults" };
  try {
    return { ...(await cachedContent()), source: "database" };
  } catch (err) {
    console.error("Could not load content from the database:", err instanceof Error ? err.message : err);
    return { settings: defaultSettings, menu: fallbackMenu, photos: placeholderPhotos, source: "defaults" };
  }
}

/* ------------------------------------------------------------------ */
/*  Admin reads (never cached)                                         */
/* ------------------------------------------------------------------ */

export async function adminGetSettings() {
  await dbReady();
  return readSettings();
}

export async function adminGetMenu() {
  await dbReady();
  return readMenu(true);
}

export async function adminGetPhotos() {
  await dbReady();
  return readPhotos();
}

/* ------------------------------------------------------------------ */
/*  Settings                                                           */
/* ------------------------------------------------------------------ */

export async function saveSection<K extends SectionKey>(key: K, value: Settings[K]) {
  await dbReady();
  const sql = getSql();
  await sql`
    INSERT INTO settings (key, value, updated_at) VALUES (${key}, ${sql.json(value as never)}, now())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`;
}

/* ------------------------------------------------------------------ */
/*  Menu                                                               */
/* ------------------------------------------------------------------ */

type ItemInput = Omit<MenuItem, "id" | "categoryId" | "sort">;

export async function addCategory(title: string) {
  await dbReady();
  const sql = getSql();
  await sql`INSERT INTO menu_categories (title, sort)
            VALUES (${title}, COALESCE((SELECT max(sort) + 1 FROM menu_categories), 0))`;
}

export async function updateCategory(id: number, title: string, visible: boolean) {
  await dbReady();
  await getSql()`UPDATE menu_categories SET title = ${title}, visible = ${visible} WHERE id = ${id}`;
}

export async function deleteCategory(id: number) {
  await dbReady();
  await getSql()`DELETE FROM menu_categories WHERE id = ${id}`;
}

export async function addItem(categoryId: number, it: ItemInput) {
  await dbReady();
  const sql = getSql();
  await sql`
    INSERT INTO menu_items (category_id, name, telugu, description, price, veg, spice, signature, available, sort)
    VALUES (${categoryId}, ${it.name}, ${it.telugu}, ${it.description}, ${it.price}, ${it.veg}, ${it.spice},
            ${it.signature}, ${it.available},
            COALESCE((SELECT max(sort) + 1 FROM menu_items WHERE category_id = ${categoryId}), 0))`;
}

export async function updateItem(id: number, categoryId: number, it: ItemInput) {
  await dbReady();
  await getSql()`
    UPDATE menu_items SET category_id = ${categoryId}, name = ${it.name}, telugu = ${it.telugu},
      description = ${it.description}, price = ${it.price}, veg = ${it.veg}, spice = ${it.spice},
      signature = ${it.signature}, available = ${it.available}
    WHERE id = ${id}`;
}

export async function deleteItem(id: number) {
  await dbReady();
  await getSql()`DELETE FROM menu_items WHERE id = ${id}`;
}

/** Swaps an entry with its neighbour (direction -1 = up, 1 = down). */
async function move(table: "menu_categories" | "menu_items" | "photos", id: string | number, direction: -1 | 1) {
  await dbReady();
  const sql = getSql();
  await sql.begin(async (tx) => {
    const scope =
      table === "menu_items"
        ? await tx`SELECT id FROM menu_items WHERE category_id = (SELECT category_id FROM menu_items WHERE id = ${id}) ORDER BY sort, id`
        : table === "photos"
          ? await tx`SELECT id FROM photos ORDER BY sort, created_at`
          : await tx`SELECT id FROM menu_categories ORDER BY sort, id`;
    const ids = scope.map((r) => String(r.id));
    const i = ids.indexOf(String(id));
    const j = i + direction;
    if (i < 0 || j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    for (const [sort, rowId] of ids.entries()) {
      await tx`UPDATE ${tx(table)} SET sort = ${sort} WHERE id::text = ${rowId}`;
    }
  });
}

export const moveCategory = (id: number, dir: -1 | 1) => move("menu_categories", id, dir);
export const moveItem = (id: number, dir: -1 | 1) => move("menu_items", id, dir);
export const movePhoto = (id: string, dir: -1 | 1) => move("photos", id, dir);

/* ------------------------------------------------------------------ */
/*  Photos                                                             */
/* ------------------------------------------------------------------ */

export async function addPhoto(p: { title: string; note: string; alt: string; mime: string; data: Buffer; width?: number; height?: number }) {
  await dbReady();
  const sql = getSql();
  await sql`
    INSERT INTO photos (title, note, alt, mime, data, width, height, sort)
    VALUES (${p.title}, ${p.note}, ${p.alt}, ${p.mime}, ${p.data}, ${p.width ?? null}, ${p.height ?? null},
            COALESCE((SELECT max(sort) + 1 FROM photos), 0))`;
}

export async function updatePhoto(id: string, p: { title: string; note: string; alt: string }) {
  await dbReady();
  await getSql()`UPDATE photos SET title = ${p.title}, note = ${p.note}, alt = ${p.alt} WHERE id = ${id}`;
}

export async function deletePhoto(id: string) {
  await dbReady();
  await getSql()`DELETE FROM photos WHERE id = ${id}`;
}

export async function getPhotoData(id: string): Promise<{ mime: string; data: Buffer } | null> {
  if (!hasDatabase() || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  await dbReady();
  const [row] = await getSql()<{ mime: string; data: Buffer }[]>`SELECT mime, data FROM photos WHERE id = ${id}`;
  return row ?? null;
}

/* ------------------------------------------------------------------ */
/*  Bookings                                                           */
/* ------------------------------------------------------------------ */

/** Privacy Policy promise: bookings are deleted 30 days after the booking date. */
export async function purgeOldBookings() {
  await getSql()`DELETE FROM bookings WHERE date < (now() AT TIME ZONE 'Asia/Kolkata')::date - 30`;
}

export async function insertBooking(b: Omit<Booking, "id" | "createdAt" | "status">) {
  await dbReady();
  const sql = getSql();
  await purgeOldBookings();
  const [row] = await sql<{ id: number }[]>`
    INSERT INTO bookings (name, phone, date, time, guests, notes)
    VALUES (${b.name}, ${b.phone}, ${b.date}, ${b.time}, ${b.guests}, ${b.notes}) RETURNING id`;
  return row.id;
}

export async function listBookings(view: "upcoming" | "past" | "all"): Promise<Booking[]> {
  await dbReady();
  await purgeOldBookings();
  const sql = getSql();
  const today = sql`(now() AT TIME ZONE 'Asia/Kolkata')::date`;
  const where =
    view === "upcoming" ? sql`WHERE date >= ${today}` : view === "past" ? sql`WHERE date < ${today}` : sql``;
  const order = view === "past" ? sql`ORDER BY date DESC, time DESC` : sql`ORDER BY date, time`;
  const rows = await sql`
    SELECT id, created_at, name, phone, to_char(date, 'YYYY-MM-DD') AS date, time, guests, notes, status
    FROM bookings ${where} ${order} LIMIT 500`;
  return rows.map((r) => ({
    id: r.id,
    createdAt: new Date(r.created_at).toISOString(),
    name: r.name,
    phone: r.phone,
    date: r.date,
    time: r.time,
    guests: r.guests,
    notes: r.notes,
    status: r.status as BookingStatus,
  }));
}

export async function bookingStats() {
  await dbReady();
  const [row] = await getSql()`
    SELECT
      count(*) FILTER (WHERE status = 'new' AND date >= (now() AT TIME ZONE 'Asia/Kolkata')::date)::int AS pending,
      count(*) FILTER (WHERE date = (now() AT TIME ZONE 'Asia/Kolkata')::date AND status <> 'cancelled')::int AS today,
      count(*) FILTER (WHERE date > (now() AT TIME ZONE 'Asia/Kolkata')::date AND status <> 'cancelled')::int AS upcoming
    FROM bookings`;
  return row as { pending: number; today: number; upcoming: number };
}

export async function setBookingStatus(id: number, status: BookingStatus) {
  await dbReady();
  await getSql()`UPDATE bookings SET status = ${status} WHERE id = ${id}`;
}

export async function deleteBooking(id: number) {
  await dbReady();
  await getSql()`DELETE FROM bookings WHERE id = ${id}`;
}
