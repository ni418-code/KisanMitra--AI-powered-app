# 🌾 Kisan Mitra — AI-Powered Agri Marketplace

A full-stack **Progressive Web App** that connects **Farmers, Buyers and Mandis**:

- Live AGMARKNET (data.gov.in) mandi prices + 30-day trends
- Official GoI **MSP** benchmarks and a net-return / best-market calculator
- Produce listings, buyer requirements and a **smart matching engine**
- Offer negotiation → orders → logistics → **4-step secure Escrow**
- **Real-time chat** and push notifications over Socket.IO
- Price alerts, grievances and an admin console
- Multilingual **AI assistant** "Kisan Mitra Sahayak" (Gemini) in 7 languages
- Installable PWA (Android/iOS) + a ready-to-build Capacitor Android project

---

## ⚠️ First: rotate your secrets

Earlier revisions of this repo committed **real credentials** in `.env.example`
and in the server source. They have been removed from the tracked files, but
**they are still visible in the git history** — treat them as compromised and
rotate them now:

| Secret | Where to rotate | Used for |
|---|---|---|
| `MONGODB_URI` | Atlas → Database Access → change password | Optional persistence |
| `GEMINI_API_KEY` | https://aistudio.google.com/apikey | AI assistant |
| `JWT_SECRET` | generate a new one: `openssl rand -hex 32` | Login tokens |
| `DATA_GOV_IN_API_KEY` | https://data.gov.in → My Account | Live mandi prices |

Every one of them is **optional** — the app boots and runs fully without any of
them (see "Graceful degradation" below).

---

## 1. Quick start

```bash
npm install
cp .env.example .env      # optional — add your own keys
npm run dev               # http://localhost:3000
```

The single Express server serves the Vite dev middleware, the REST API under
`/api` and the Socket.IO endpoint — so the frontend never needs a separate port.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with HMR (Vite middleware) |
| `npm run build` | Production bundle → `dist/` |
| `npm start` | Serve the built app + API (reads `process.env.PORT`) |
| `npm run lint` | TypeScript type-check (`tsc --noEmit`) |
| `npm run test:api` | 54-check end-to-end REST smoke test |
| `npm run test:realtime` | Socket.IO chat / notification / typing test |
| `npm run test:ui` | Renders every view for every role in jsdom and fails on any console error |
| `npm test` | lint + all three suites |

The test suites expect the server to already be running:

```bash
npm run dev                       # terminal 1
npm test                          # terminal 2
# or point them elsewhere:  node scripts/smoke-test.mjs https://your-app.onrender.com
```

---

## 2. Demo logins

One-click from the landing page, or `POST /api/auth/demo-login { role }`:

| Role | Name | Phone | OTP |
|------|------|-------|-----|
| 🌾 Farmer | Ramesh Patel | `9876543210` | `123456` |
| 🏢 Buyer | Rajesh Agro Foods Ltd | `9123456780` | `123456` |
| 🔐 Admin | Kisan Mitra Admin | `9999999999` | `123456` |

Any other phone number works too — request an OTP and the code is returned in
the API response and printed in the server log.

---

## 3. Environment variables

Copy `.env.example` → `.env`. **Never commit `.env`** (already gitignored).

| Variable | Required | Fallback when missing |
|---|---|---|
| `PORT` | No (hosting platforms inject it) | `3000` |
| `NODE_ENV` | Set to `production` when deploying | dev mode |
| `MONGODB_URI` | No | In-memory store (data resets on restart) |
| `GEMINI_API_KEY` | No | Grounded offline knowledge engine answers |
| `JWT_SECRET` | No | Random per-boot secret (sessions reset on restart) |
| `DATA_GOV_IN_API_KEY` | No | Verified AGMARKNET baseline data set |
| `DATA_GOV_IN_RESOURCE_ID` | No | AGMARKNET daily arrivals resource |
| `MARKET_SYNC_INTERVAL_MINUTES` | No | `30` |
| `APP_URL`, `CORS_ORIGIN` | No | Public URL / permissive CORS |
| `VITE_API_BASE_URL` | Only for the Android APK | Same-origin `/api` |

---

## 4. Architecture — how the files connect

```
server.ts                     Express + Socket.IO entry point
├── src/server/routes/api.ts  All REST routes (mounted at /api)
│   └── controllers/*         One per domain (auth, market, product, offer, order…)
│       └── services/*
│           ├── dataStore.ts        In-memory store (single source of truth)
│           ├── persistence.ts      Mirrors it to MongoDB when connected
│           ├── realtimeBus.ts      Pushes socket events from controllers
│           ├── marketService.ts    AGMARKNET sync + price queries
│           ├── mspService.ts       Official MSP reference data
│           ├── matchingEngine.ts   Farmer ↔ buyer match scoring
│           ├── recommendationService.ts  Net-return / best-market maths
│           └── aiService.ts        Gemini + grounded fallback answers
│       └── models/*          Mongoose schemas (used by persistence.ts)
├── src/context/AuthContext   Session, JWT, language/i18n
├── src/context/SocketContext Single Socket.IO connection for the whole app
├── src/services/api.ts       Typed REST client (same-origin /api by default)
└── src/components/*          30+ views, all reading through services/api.ts
```

**Data flow:** React view → `services/api.ts` → Express route → controller →
`dataStore` → (optional) MongoDB mirror + Socket.IO push → other clients.

### Graceful degradation

The platform is designed so a missing dependency never breaks a request:

| Missing | Result |
|---|---|
| MongoDB | In-memory store; data resets on restart |
| Gemini key | Assistant answers from the built-in grounded knowledge base |
| data.gov.in key | Verified AGMARKNET baseline prices |
| Socket.IO | Chat/notifications fall back to HTTP polling |

### MongoDB persistence

When `MONGODB_URI` is set **and reachable**, the app:

1. **hydrates** the in-memory store from the database on boot (a collection is
   only replaced when it actually has documents, so the demo seed data survives
   on an empty cluster), and
2. **mirrors every write** back (fire-and-forget, never blocks a request),
3. **flushes** on `SIGTERM`/`SIGINT` so graceful deploys don't lose state.

If the connection drops, everything silently falls back to memory.

---

## 5. Deploy to Render (free)

1. Push this repo to GitHub.
2. Render → **New → Blueprint** → pick the repo (it reads `render.yaml`), or
   create a **Web Service** manually with:
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm run start`
   - **Health check path:** `/api/health`
3. Add the environment variables from the table above (all optional).
4. Deploy → `https://<your-service>.onrender.com`.

> `tsx` is a runtime dependency precisely so `npm run start` keeps working even
> on hosts that install with `--omit=dev`. Do **not** set `PORT` yourself —
> Render injects it and the server binds to it.

Any Node host works the same way (Railway, Fly.io, VPS…): build with
`npm run build`, start with `npm start`, bind `$PORT`.

---

## 6. Install as a mobile app (no store, 100% free)

Kisan Mitra is a PWA: `public/manifest.webmanifest`, `public/sw.js` and app
icons are served from the same origin.

- **Android — Chrome:** ⋮ → *Add to Home screen* → *Install*
- **iPhone — Safari:** Share → *Add to Home Screen*

### Build an APK

The Capacitor Android project is already generated in `android/`:

```bash
VITE_API_BASE_URL="https://your-app.onrender.com" npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
# → android/app/build/outputs/apk/debug/app-debug.apk
```

`VITE_API_BASE_URL` is what lets the APK reach your deployed API — without it
the app would only show an empty UI. Zero-install alternative: paste your URL
into **https://www.pwabuilder.com** and download the generated package.

---

## 7. Tech stack

React 19 · TypeScript · Vite 6 · Tailwind CSS 4 · Socket.IO · Express 4 ·
Mongoose 9 · Google Gemini (`@google/genai`) · Recharts · Lucide · jsdom tests

---

## 8. What was fixed in this pass

- **Session restore:** a logged-in user who refreshed the page was stranded on
  the marketing landing page with no way into the workspace; the app now lands
  them on their dashboard (admin → admin console) and the landing header shows
  a *Go to Dashboard* button.
- **Real-time actually reaches the UI:** the server now pushes `new-message` and
  `notification` events (previously only client-emitted echoes worked), and a new
  `NotificationBell` component in the header consumes them.
- **MongoDB was decorative:** 11 Mongoose models existed but only one was used.
  Added a persistence bridge (`src/server/services/persistence.ts`) that
  hydrates on boot, mirrors writes and flushes on shutdown.
- **Order schema data loss:** the Mongoose `Order` schema declared neither the
  4-step escrow fields nor the `released` / `escrow_funded` payment states, so
  those fields were silently stripped on save. Fixed, and schemas are now
  `strict: false` so future app-side fields survive a round-trip.
- **Write paths that bypassed the store:** `simulatePayment`, `rejectOffer`,
  `deleteOffer`, `toggleAlert` and `sendMessage` mutated objects in place
  instead of going through `dataStore`, so they would never have persisted.
  All now route through the store.
- **Committed credentials removed** from `.env.example`, `config/db.ts`,
  `middleware/auth.ts` and `services/marketService.ts` (see §0).
- **Boot time:** removing the always-attempted Atlas connection and the
  data.gov.in fetch when unconfigured cut cold start from ~17s to ~2s.
- **Dead code removed:** `components/Navbar.tsx` and `components/BottomNav.tsx`
  were not imported anywhere.
- **Crash hardening:** `scrollIntoView` is now feature-detected.
- **`tsx` moved to `dependencies`** so `npm run start` works on hosts that skip
  devDependencies; added `engines.node >= 20`; named the package properly.
- Added `scripts/smoke-test.mjs` (54 checks), `scripts/realtime-test.mjs` and
  `scripts/ui-smoke-test.mjs` (renders all 39 role/view combinations).

### Known limitations

- The MongoDB path could not be integration-tested here (Atlas is unreachable
  from the build sandbox); it is best-effort and fails open to memory.
- Produce listings support add / delete / mark-sold from the UI; there is no
  edit form yet (the `PUT /api/products/:id` endpoint exists and is tested).
- Payments are a simulated escrow flow — no real payment gateway.
