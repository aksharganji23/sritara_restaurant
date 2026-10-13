# Risks & launch checklist

Things that are **not** solved by code alone. Work through this before going live.

## 🔴 Must fix before launch

| # | Risk | Why it matters | What to do |
|---|------|----------------|------------|
| 1 | **Placeholder business details** | `lib/site.ts` has items marked `VERIFY`: email, domain, FSSAI number, Grievance Officer, exact hours, map coordinates. Wrong hours or a fake email mislead customers. | Confirm every `VERIFY` with the owner. Search the codebase for `VERIFY` and `[`. |
| 2 | **Menu is reconstructed from reviews** | Dishes came from guest reviews, not the official menu. No prices shown. | Get the real menu and update `menu` in `lib/site.ts`. |
| 3 | **Placeholder photos** | `/public/images/*.svg` are placeholders. | Use photos the restaurant **owns**. Don't download photos from Google Maps — copyright belongs to the uploader. Update the `alt` text in `components/Gallery.tsx` to describe each real photo, then remove `unoptimized`. |
| 4 | **Legal pages are templates** | Written for India (DPDP Act 2023, IT Act 2000, Consumer Protection Act 2019) but not legal advice. The DPDP Rules are being phased in, so obligations can change. | Have a lawyer review all four pages. Fill in the hosting provider and booking-delivery tool in the Privacy Policy. |
| 5 | **Online booking is off by default** | Without `RESERVATION_WEBHOOK_URL` the form tells guests to call. | Set up a webhook (n8n, Make, Zapier, or your own API) that notifies staff, e.g. by WhatsApp/SMS/email. Update the Privacy Policy with the provider name. |
| 6 | **Google rating & review count are hard-coded** | "4.5 · 26 reviews" will drift and could become misleading advertising. | Update periodically or remove from `site.rating`. |

## 🟠 Should fix

| # | Risk | Notes |
|---|------|-------|
| 7 | **Rate limiting is in-memory** | Works on a single server. On serverless (Vercel/Netlify) each instance has its own memory, so bots can bypass it. Use Upstash Redis rate-limiting, Cloudflare Turnstile, or your host's WAF. |
| 8 | **Data retention promise** | The Privacy Policy says booking data is deleted 30 days after the booking date. Your webhook destination (Google Sheet, CRM, WhatsApp) must actually do this. |
| 9 | **`'unsafe-inline'` in CSP** | Needed by Next.js inline scripts and Motion's inline styles. For stricter CSP, switch to nonce-based CSP via `proxy.ts` (makes every page dynamic). |
| 10 | **Reviews on the site** | The Reviews section paraphrases themes and links to Google. Don't paste reviewers' names or full words without permission. |
| 11 | **Allergen information** | Shared-kitchen notice is present. If you list allergens per dish, keep them accurate — food-safety liability. |
| 12 | **Open/closed indicator** | `components/OpenStatus.tsx` hard-codes 12:00–23:00 IST. Update it if hours change or you close on holidays. |

## 🟢 Third-party embeds — audited

| Embed | Status |
|-------|--------|
| Google Maps iframe | **Click-to-load only.** No request to Google until the visitor clicks. Sandboxed, `strict-origin-when-cross-origin` referrer, listed in the Cookie Policy, allowed only in `frame-src` of the CSP. |
| Google Fonts | **Not used.** Fonts are self-hosted via `@fontsource-variable/*`, so no visitor IPs go to Google. |
| Analytics / pixels / chat widgets | **None.** If you add any (GA, Meta Pixel, WhatsApp widget), you must: add a consent banner, extend the CSP, and update the Cookie & Privacy policies. Prefer cookieless analytics (Plausible, Umami, Vercel Analytics). |
| External links | Open in a new tab with `rel="noopener noreferrer"` and a screen-reader "(opens in a new tab)" note. |

## ✅ Already handled in code

- **Dark mode only** — `color-scheme: dark`, no toggle.
- **Contrast** — all theme pairs pass WCAG 2.2 AA; run `npm run contrast` after changing colours.
- **Keyboard** — skip link, visible focus ring, focus-trapped mobile menu with Escape, ARIA tabs with arrow keys / Home / End, error summary with links to fields, focus moves to errors and success messages.
- **Forms** — every input has a visible `<label>`; required fields marked; hints and errors linked with `aria-describedby`; `aria-invalid`; correct `autocomplete` and `inputMode`.
- **Clear button labels** — "Request a table", "Load Google Map", "Open menu/Close menu"; no icon-only buttons without labels.
- **Alt text** — descriptive on content images; decorative SVGs are `aria-hidden`.
- **Reduced motion** — `MotionConfig reducedMotion="user"` + CSS that disables animations for `prefers-reduced-motion`.
- **Data minimisation** — name, phone, date, time, guests, optional notes. No email, no account, no payment. Explicit consent checkbox (not pre-ticked). IP used transiently for rate limiting only. Personal data is never logged.
- **Security headers** — CSP, HSTS, nosniff, Referrer-Policy, Permissions-Policy, COOP, `frame-ancestors 'none'`, `X-Powered-By` removed.
- **Spam** — honeypot field + rate limiting.
- **SEO** — metadata, canonical URLs, sitemap, robots, `Restaurant` JSON-LD structured data.

## Still to test manually

- Screen readers: NVDA (Windows) and TalkBack (Android — most of your visitors will be on Android phones).
- Lighthouse / axe DevTools on the deployed site.
- Zoom to 200% and 400% (reflow).
- Slow 3G throttling — many visitors will be on mobile data.
