# Sritara Classic — Restaurant Website

Dark-themed, animated website for **Sritara Classic Multi Cuisine Restaurant**, Bhupalpally, Telangana.

**Read [`RISKS.md`](./RISKS.md) before launching** — it lists every placeholder and open risk.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, Turbopack, Server Actions) |
| UI | React 19 |
| Styling | Tailwind CSS 4 (CSS-first `@theme` tokens) |
| Animation | Motion (`motion/react`) |
| Validation | Zod 4 |
| Icons | Lucide |
| Fonts | Fraunces + Manrope, self-hosted via Fontsource |
| Language | TypeScript (strict) |

Versions in `package.json` were the latest on npm at build time (Oct 2026); bump them with `npx npm-check-updates -u && npm install`.

## Run it

```bash
npm install
cp .env.example .env.local   # then edit
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
npm run contrast             # WCAG colour-contrast check
```

Requires Node.js 20.9+.

## Where to edit things

| What | File |
|------|------|
| Name, phone, address, hours, rating, legal IDs | `lib/site.ts` |
| Menu | `lib/site.ts` → `menu` |
| Photos + alt text | `public/images/` and `components/Gallery.tsx` |
| Colours | `app/globals.css` → `@theme` (then run `npm run contrast`) |
| Booking form fields / rules | `lib/reservation-schema.ts` |
| Where bookings go | `RESERVATION_WEBHOOK_URL` env var, `app/actions/reserve.ts` |
| Security headers / CSP | `next.config.ts` |
| Legal pages | `app/privacy-policy`, `app/cookie-policy`, `app/terms`, `app/refund-policy` |

## Structure

```
app/
  layout.tsx            Root layout, metadata, JSON-LD, skip link
  page.tsx              Home (hero → menu → about → gallery → reviews → visit → reserve)
  actions/reserve.ts    Server Action: validate, rate-limit, forward booking
  privacy-policy/ cookie-policy/ terms/ refund-policy/
  sitemap.ts robots.ts not-found.tsx icon.svg globals.css
components/             Header, Hero, MenuSection, About, Gallery, Reviews, Visit,
                        ConsentMap, OpenStatus, Reserve, ReserveForm, Footer, …
lib/                    site.ts (content), reservation-schema.ts (Zod)
scripts/check-contrast.mjs
```

## Deploy

Works on Vercel, Netlify, Cloudflare, or any Node host (`npm run build && npm start`). Set `NEXT_PUBLIC_SITE_URL` and (optionally) `RESERVATION_WEBHOOK_URL` in the host's environment settings.

### Webhook payload

```json
{ "name": "Ravi Kumar", "phone": "9876543210", "date": "2026-10-20",
  "time": "19:30", "guests": 4, "notes": "", "submittedAt": "2026-10-13T17:00:00.000Z" }
```
