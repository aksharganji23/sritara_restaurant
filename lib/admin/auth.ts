// Server-only admin authentication: one shared password (ADMIN_PASSWORD env var).
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "sritara_admin";
const SESSION_DAYS = 7;
export const MIN_PASSWORD_LENGTH = 10;

const password = () => process.env.ADMIN_PASSWORD ?? "";

/** True when ADMIN_PASSWORD is set and long enough. */
export const adminConfigured = () => password().length >= MIN_PASSWORD_LENGTH;

/**
 * Signing key for session cookies. Derived from ADMIN_SESSION_SECRET if set,
 * otherwise from the password — so changing the password signs everyone out.
 */
function signingKey() {
  return createHash("sha256")
    .update(`sritara-admin-session:${process.env.ADMIN_SESSION_SECRET ?? ""}:${password()}`)
    .digest();
}

const b64url = (buf: Buffer) => buf.toString("base64url");

function sign(payload: string) {
  return b64url(createHmac("sha256", signingKey()).update(payload).digest());
}

function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(attempt: string) {
  return adminConfigured() && safeEqual(attempt, password());
}

export async function createSession() {
  const exp = Date.now() + SESSION_DAYS * 86_400_000;
  const payload = b64url(Buffer.from(JSON.stringify({ exp })));
  const jar = await cookies();
  // Secure (HTTPS-only) whenever the site is served over HTTPS — always the case on Render.
  const h = await headers();
  const https = h.get("x-forwarded-proto") === "https";
  jar.set(SESSION_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: https,
    sameSite: "strict",
    path: "/admin",
    maxAge: SESSION_DAYS * 86_400,
  });
}

export async function destroySession() {
  (await cookies()).delete({ name: SESSION_COOKIE, path: "/admin" });
}

export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || !safeEqual(sig, sign(payload))) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

/** Use at the top of every admin page AND every admin server action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

/* Login rate limit: 5 failed attempts per 15 minutes per IP. */
const failures = new Map<string, { count: number; reset: number }>();

export function loginBlocked(ip: string) {
  const f = failures.get(ip);
  return Boolean(f && f.reset > Date.now() && f.count >= 5);
}

export function recordFailure(ip: string) {
  const now = Date.now();
  for (const [k, v] of failures) if (v.reset < now) failures.delete(k);
  const f = failures.get(ip);
  if (!f || f.reset < now) failures.set(ip, { count: 1, reset: now + 15 * 60_000 });
  else f.count++;
}

export function clearFailures(ip: string) {
  failures.delete(ip);
}
