// Server-only database access (Neon Postgres, or any Postgres via DATABASE_URL).
import postgres from "postgres";
import { defaultMenu } from "./content/defaults";

type Sql = ReturnType<typeof postgres>;

const globalForDb = globalThis as unknown as { __sql?: Sql; __dbReady?: Promise<void> };

export const hasDatabase = () => Boolean(process.env.DATABASE_URL);

/** Shared connection pool (re-used across hot reloads in dev). */
export function getSql(): Sql {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  if (!globalForDb.__sql) {
    globalForDb.__sql = postgres(process.env.DATABASE_URL, {
      max: 5,
      idle_timeout: 20,
      connect_timeout: 15,
      prepare: false, // required for Neon's pooled (PgBouncer) connection string
      onnotice: () => {},
    });
  }
  return globalForDb.__sql;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS settings (
  key        text PRIMARY KEY,
  value      jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS menu_categories (
  id      serial PRIMARY KEY,
  title   text NOT NULL,
  sort    integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true
);
CREATE TABLE IF NOT EXISTS menu_items (
  id          serial PRIMARY KEY,
  category_id integer NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name        text NOT NULL,
  telugu      text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  price       integer,
  veg         boolean NOT NULL DEFAULT true,
  spice       integer NOT NULL DEFAULT 0,
  signature   boolean NOT NULL DEFAULT false,
  available   boolean NOT NULL DEFAULT true,
  sort        integer NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS bookings (
  id         serial PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  name       text NOT NULL,
  phone      text NOT NULL,
  date       date NOT NULL,
  time       text NOT NULL,
  guests     integer NOT NULL,
  notes      text NOT NULL DEFAULT '',
  status     text NOT NULL DEFAULT 'new'
);
CREATE INDEX IF NOT EXISTS bookings_date_idx ON bookings (date);
CREATE TABLE IF NOT EXISTS photos (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text NOT NULL DEFAULT '',
  note       text NOT NULL DEFAULT '',
  alt        text NOT NULL,
  mime       text NOT NULL,
  data       bytea NOT NULL,
  width      integer,
  height     integer,
  sort       integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
`;

/** Creates tables on first use and fills in the starting menu once. */
export function dbReady(): Promise<void> {
  if (!globalForDb.__dbReady) {
    globalForDb.__dbReady = (async () => {
      const sql = getSql();
      await sql.unsafe(SCHEMA);
      await sql.begin(async (tx) => {
        await tx`SELECT pg_advisory_xact_lock(4242001)`;
        const [seeded] = await tx`SELECT 1 FROM settings WHERE key = '_seeded'`;
        if (seeded) return;
        for (const [ci, cat] of defaultMenu.entries()) {
          const [row] = await tx`INSERT INTO menu_categories (title, sort) VALUES (${cat.title}, ${ci}) RETURNING id`;
          for (const [ii, it] of cat.items.entries()) {
            await tx`
              INSERT INTO menu_items (category_id, name, telugu, description, price, veg, spice, signature, available, sort)
              VALUES (${row.id}, ${it.name}, ${it.telugu}, ${it.description}, ${it.price}, ${it.veg}, ${it.spice}, ${it.signature}, ${it.available}, ${ii})`;
          }
        }
        await tx`INSERT INTO settings (key, value) VALUES ('_seeded', ${tx.json({ at: new Date().toISOString() })})`;
      });
    })().catch((err) => {
      globalForDb.__dbReady = undefined; // retry on next request
      throw err;
    });
  }
  return globalForDb.__dbReady;
}
