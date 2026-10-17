# Risks & launch checklist

Things that are **not** solved by code alone. Work through this before going live.

## 🔐 Admin panel

| Risk | Handling |
|------|----------|
| Weak admin password | Must be 10+ characters. Use a long passphrase; don't reuse it elsewhere. Change it in Render → Environment if anyone leaves. |
| Password guessing | 5 wrong attempts per IP per 15 minutes, plus a delay on each failure. |
| Stolen session | Cookie is httpOnly, SameSite=Strict, scoped to `/admin`, HTTPS-only on Render, signed with HMAC and expires after 7 days. Changing the password signs everyone out. |
| Skipping the login | Every admin page **and** every save action checks the session on the server (tested: anonymous and forged-cookie saves are rejected). |
| Secret keys exposed | Telegram token / CallMeBot key are stored server-side only; the admin page only shows whether one is saved. Never logged. |
| Admin in Google | `/admin` sends `noindex` and is disallowed in robots.txt. |
| Shared password | One password for all staff means you can't tell who changed what or remove one person. If that matters, switch to separate accounts. |
| Uploaded photos | Re-encoded to WebP (strips GPS/EXIF), max 10 MB, image types only. Only upload photos the restaurant owns. |
| Database backups | Neon keeps a short restore history on the free plan. Export the menu occasionally if it's critical. |

## 🔴 Must fix before launch

| # | Risk | Why it matters | What to do |
|---|------|----------------|------------|
| 1 | **Unconfirmed business details** | Hours, map pin, email, FSSAI number and Grievance Officer need checking. | Fill them in at **Admin → Settings**. |
| 2 | **Menu is reconstructed from reviews** | Starting dishes came from guest reviews; no prices yet. | Enter the real menu at **Admin → Menu**. |
| 3 | **Placeholder photos** | Illustrations show until the first upload. | Upload real photos at **Admin → Photos** (not copied from Google Maps — copyright belongs to the uploader). |
| 4 | **Legal pages are templates** | Written for India (DPDP Act 2023, IT Act 2000, Consumer Protection Act 2019) but not legal advice. The DPDP Rules are being phased in, so obligations can change. | Have a lawyer review all four pages. Fill in the hosting provider and booking-delivery tool in the Privacy Policy. |
| 5 | **Nobody watching bookings** | Requests are saved in Admin → Bookings, but staff must check them. | Turn on WhatsApp or Telegram alerts in **Admin → Settings → Booking alerts**. |
| 6 | **Google rating can drift** | The rating shown is typed in, not live. | Update it in **Admin → Settings → Google rating**, or untick “Show”. |

## 🟠 Should fix

| # | Risk | Notes |
|---|------|-------|
| 7 | **Rate limiting is in-memory** | Works on a single server. On serverless (Vercel/Netlify) each instance has its own memory, so bots can bypass it. Use Upstash Redis rate-limiting, Cloudflare Turnstile, or your host's WAF. |
| 8 | **Data retention promise** | Bookings in the database are deleted automatically 30 days after their date. Copies in WhatsApp/Telegram chats aren't — clear old alert messages periodically. |
| 9 | **`'unsafe-inline'` in CSP** | Needed by Next.js inline scripts and Motion's inline styles. For stricter CSP, switch to nonce-based CSP via `proxy.ts` (makes every page dynamic). |
| 10 | **Reviews on the site** | The Reviews section paraphrases themes and links to Google. Don't paste reviewers' names or full words without permission. |
| 11 | **Allergen information** | Shared-kitchen notice is present. If you list allergens per dish, keep them accurate — food-safety liability. |
| 12 | **Holiday closures** | Weekly hours don't know about festivals. Use the **announcement bar** (Admin → Settings → Restaurant details) for one-off closures. |

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
- **Data minimisation** — name, phone, date, time, guests, optional notes. No email, no account, no payment. Explicit consent checkbox (not pre-ticked). IP used transiently for rate limiting only. Personal data is never logged. Bookings auto-delete 30 days after their date.
- **Security headers** — CSP, HSTS, nosniff, Referrer-Policy, Permissions-Policy, COOP, `frame-ancestors 'none'`, `X-Powered-By` removed.
- **Spam** — honeypot field + rate limiting.
- **SEO** — metadata, canonical URLs, sitemap, robots, `Restaurant` JSON-LD structured data.

## Still to test manually

- Screen readers: NVDA (Windows) and TalkBack (Android — most of your visitors will be on Android phones).
- Lighthouse / axe DevTools on the deployed site.
- Zoom to 200% and 400% (reflow).
- Slow 3G throttling — many visitors will be on mobile data.
