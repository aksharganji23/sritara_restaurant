# Sritara Classic — Restaurant Website + Admin

Two parts in one project, sharing one database:

| | Address | Who uses it |
|---|---|---|
| **Customer website** | `/` | Guests: menu, photos, hours, map, table booking |
| **Admin panel** | `/admin` | Restaurant staff: change everything, see bookings |

Whatever you save in the admin appears on the website **immediately**.

## What the admin can change

- **Bookings** — every table request; call or WhatsApp the guest, mark confirmed / cancelled.
- **Menu** — add, edit, reorder, delete dishes and sections; prices; veg/non-veg; spice; mark *Sold out* in one click.
- **Photos** — upload gallery photos (auto-resized, location data removed), alt text, order.
- **Settings**
  - Restaurant details: names, headline, intro, story, price range, services, **announcement bar**
  - Contact & location: **phone, WhatsApp**, email, address, **map pin**
  - Opening hours per day (drives "Open now", Google data and allowed booking times)
  - Booking rules: on/off, max guests, days ahead, last booking time
  - **Booking alerts**: WhatsApp (CallMeBot) and Telegram numbers/keys
  - Google rating, legal details (FSSAI, GSTIN, Grievance Officer)

## Setup (one time, ~15 minutes)

### 1. Create the database (Neon, free)
1. Go to **neon.tech** → sign up → **Create project**. Pick the region closest to India (e.g. **Singapore**).
2. On the project dashboard click **Connect** and copy the connection string (it starts with `postgresql://` and ends with `?sslmode=require`).

Tables are created automatically the first time the site runs, and the starting menu is filled in.

### 2. Run it on your computer
```bash
npm install
cp .env.example .env.local     # Windows: copy .env.example .env.local
```
Edit `.env.local`: paste `DATABASE_URL`, and set `ADMIN_PASSWORD` (10+ characters). Then:
```bash
npm run dev
```
- Website: http://localhost:3000
- Admin: http://localhost:3000/admin

### 3. Put it online (Render)
In your Render web service → **Environment**, add `DATABASE_URL`, `ADMIN_PASSWORD` and `NEXT_PUBLIC_SITE_URL`, then **Manual Deploy → Deploy latest commit**.
Choose the same region as Neon (Singapore) so pages load fast.

| Render setting | Value |
|---|---|
| Build command | `npm ci && npm run build` |
| Start command | `npm start` |
| Environment | `NODE_VERSION=22` plus the keys above (never set `NODE_ENV`) |

### 4. Booking alerts (optional)
Admin → Settings → **Booking alerts**:
- **WhatsApp**: from the receiving phone's WhatsApp, send `I allow callmebot to send me messages` to **+34 644 31 95 65**, paste the key it replies with.
- **Telegram**: message **@BotFather** → `/newbot` → copy the token; press *Start* in your bot and send "hi"; open `https://api.telegram.org/bot<TOKEN>/getUpdates` and copy `"chat":{"id":…}`.

Bookings are always saved in Admin → Bookings even if no alert is set up.

## Good to know

- **Forgot the admin password?** Change `ADMIN_PASSWORD` in Render → Environment and redeploy.
- **No database?** The site still works with built-in starting content (`lib/content/defaults.ts`), but nothing can be saved.
- **Free plans:** Render's free service sleeps after 15 minutes without visitors (first visit takes ~1 minute). Neon's free database also pauses when idle and wakes in about a second.
- **Privacy:** bookings are deleted automatically 30 days after their date, as the Privacy Policy promises.

## Project structure
```
app/(site)/            Customer pages (home + legal pages)
app/admin/             Admin: login + (panel)/ dashboard, bookings, menu, photos, settings
app/admin/actions.ts   Every admin save — each one checks the login first
app/actions/reserve.ts Customer booking: validate → save → alert phone
app/media/[id]/        Serves uploaded photos
lib/content/           Data model (schema), defaults, database reads/writes, hours logic
lib/admin/auth.ts      Password check, signed session cookie, login rate limit
lib/notify.ts          WhatsApp / Telegram / webhook alerts
lib/db.ts              Database connection + automatic table creation
```

## Commands
```bash
npm run dev        # local development
npm run build      # production build
npm start          # run the production build
npm run contrast   # WCAG colour-contrast check
```
