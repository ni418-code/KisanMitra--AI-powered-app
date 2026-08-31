# 🌾 Kisan Mitra — Agri Marketplace (Smart India Hackathon Prototype)

Kisan Mitra is a **Progressive Web App (PWA)** that connects **Farmers, Buyers, and Markets** with:

- Real-time AGMARKNET (data.gov.in) mandi prices
- Official GoI MSP benchmarks & net-return calculator
- Crop listings, buyer requirements, smart matching engine
- Offer negotiation, orders, logistics & storage
- 4-step secure **Escrow** payments
- Real-time chat (Socket.IO) with notifications
- Price alerts & grievances
- Bulletins in **7 languages** (English, తెలుగు, हिन्दी, தமிழ், ಕನ್ನಡ, മലയാളം, मराठी)
- Multilingual **AI assistant** "Kisan Mitra Sahayak" (Gemini)

---

## 1. ✅ Fix for the "error while running on Render"

### The bug
The server hard‑coded its port:

```ts
// server.ts (BEFORE)
const PORT = 3000;
```

Render injects a **dynamic `PORT` environment variable** for every web service. Because the app ignored it and tried to bind to `3000`, Render could not reach the app and the deployment errored out / health checks failed.

### The fix (already applied)
The server now reads the port from the environment, falling back to `3000` only for local development:

```ts
// server.ts (AFTER)
// Render injects a dynamic PORT env var; fall back to 3000 for local dev.
const PORT = Number(process.env.PORT) || 3000;
```

That is the exact change that makes the app work on Render. I verified it by starting the server with `PORT=8080` and confirming it binds to `8080`.

---

## 2. 🚀 How to deploy on Render (free)

1. Push this repo to GitHub.
2. In Render → **New → Web Service**, pick the repo.
3. Set:
   - **Name:** `kisan-mitra`
   - **Runtime:** Node
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm run start`
   - **Instance type:** Free
4. Add the environment variables (from [`.env.example`](./.env.example)):
   - `GEMINI_API_KEY` — for the AI assistant
   - `JWT_SECRET` — any random string
   - `DATA_GOV_IN_API_KEY` + `DATA_GOV_IN_RESOURCE_ID` — for live mandi data
   - `MONGODB_URI` — *optional*. If MongoDB Atlas is not whitelisted, the app automatically falls back to a built‑in in‑memory data store, so it still works fully.
   - `CORS_ORIGIN` — your app URL
5. Deploy. The app serves on `https://your-app.onrender.com`.

A [`render.yaml`](./render.yaml) blueprint is included if you prefer "New → Blueprint".

> ⚠️ **Note:** Do **not** set `PORT` manually — Render provides it automatically, and the app now uses it.

---

## 3. 📱 Convert to a mobile app (no App Store / Google Play, 100% free)

Kisan Mitra is now a full **PWA**. That means it can be installed on a phone **like a native app**, without any app store, subscription, or payment.

### iPhone (iOS) — free, no App Store
1. Open the live URL in **Safari**.
2. Tap the **Share** button (square with an arrow).
3. Tap **Add to Home Screen**.
4. Tap **Add**. A Kisan Mitra app icon appears on your home screen and opens full‑screen, standalone.

> iOS does **not** run `.apk` files — this is the correct, free app experience for iPhone.

### Android — free, no Play Store
- **Option A (recommended, 2 taps):** Open the URL in **Chrome → ⋮ menu → Add to Home screen → Install**. The app installs as a standalone app with its own icon (because of the service worker + manifest).
- **Option B (sideload, fine for judging):** Generate an APK below.

### Why it's installable now
Added a web‑app manifest, service worker, icons, and meta tags:
- `public/manifest.webmanifest`
- `public/sw.js` (offline app‑shell caching; API calls always network‑first)
- `public/icons/*` + `public/og-image.jpg`
- PWA tags in [`index.html`](./index.html)

---

## 4. 🤖 Build an APK (Android, free, no Play Console)

> ⚠️ **The `.apk` binary cannot be compiled inside this AI Studio sandbox.** The sandbox has **no Java, no Android SDK, and no internet access to Google/Gradle/Maven hosts** (only the npm registry is reachable), so a real APK cannot be built here. The **entire Android project is already generated for you** in the [`android/`](./android) folder — building the actual `.apk` is **one command away on your own computer** (which has internet + Android Studio).

### Crucial: point the app at your backend
The web app calls the API at the **same origin** (`/api`). Inside an APK there is no built‑in server, so you must tell the build where the backend lives before building:

```bash
VITE_API_BASE_URL="https://your-app.onrender.com" npm run build   # web deploy NOT needed
```

This bakes your deployed Render URL into the app so the APK can reach the live API (market prices, chat, orders, etc.). Without it the APK would only show an empty UI. I verified the variable is correctly baked into the bundle.

> **If you haven't deployed yet:** you can still build the APK and simply point `VITE_API_BASE_URL` to your own machine later — but for a working demo, deploy to Render first (Step 2).

### Option A — PWABuilder (fastest, zero code, recommended for judging)
1. Go to **https://www.pwabuilder.com**
2. Enter your deployed URL (e.g. `https://your-app.onrender.com`) → **Start**.
3. It validates the manifest/service worker. Choose **Android → Generate package**.
4. Download the **`.apk`** (or `.aab`). This uses a Trusted Web Activity — the app is just your website wrapped as an installable app.
5. Transfer the APK to your Android phone and allow **"Install from unknown sources"** to sideload it for the demo.

### Option B — Capacitor (full native wrapper) — project already generated ✅
The Capacitor Android project is **already built** in this repo:
- `android/` — complete Gradle Android project, `com.kisanmitra.app`, versionName `1.0`
- Branded launcher icons (KisanMitra logo) at all densities
- Web assets (built `dist/`) already copied into `android/app/src/main/assets/public`
- Gradle wrapper (`gradlew`) bundled — you don't download Gradle separately

On **your machine** (with Android Studio installed):

```bash
# 1. install deps + set the backend URL
npm install
VITE_API_BASE_URL="https://your-app.onrender.com" npm run build

# 2. sync the fresh web build into Android
npx cap sync android

# 3. build the APK (debug = installable on any phone)
cd android
./gradlew assembleDebug
# output: android/app/build/outputs/apk/debug/app-debug.apk
```

Or in Android Studio: **`npx cap open android`** → **Build → Build APK(s)** → the APK appears in the output folder.

Sideload it: copy `app-debug.apk` to your phone, allow **"Install from unknown sources"**, and install.

> Java JDK 17+ and the Android SDK are required only on **your** machine. The [`android/`](./android) project here is the exact starting point.

---

## 5. 🧑‍🎓 Demo logins (no sign‑up needed)

Use the **"Sign In" → role dropdown**, or the one‑click demo login buttons on the landing page:

| Role | Name | Phone | OTP |
|------|------|-------|-----|
| 🌾 Farmer | Ramesh Patel | `9876543210` | `123456` |
| 🏢 Buyer | Rajesh Agro Foods Ltd | `9123456780` | `123456` |
| 🔐 Admin | Kisan Mitra Admin | `9999999999` | `123456` |

Any phone number also works — request an OTP and the code is shown on screen / in the server log.

---

## 6. 🛠️ Local development

```bash
npm install          # install dependencies
npm run dev          # start dev server (http://localhost:3000)
npm run build        # production build to /dist
npm run start        # run the built app (reads process.env.PORT)
npm run lint         # TypeScript type-check
```

Environment variables live in `.env` (copy from `.env.example`).

---

## 7. 📂 Tech stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, Lucide icons, Recharts, Framer Motion
- **Backend:** Express, Socket.IO
- **Data:** In‑memory store with MongoDB Atlas fallback (best‑effort)
- **AI:** Google Gemini (`@google/genai`)
- **PWA:** Web App Manifest + Service Worker

---

## 8. ❓ A note on "Notetaker / LinkedIn" files

I searched the whole repository for any files named or referencing **"Notetaker"**, **"LinkedIn"**, **"notetake"**, etc. — **none exist** in this project. This repo is the Kisan Mitra agri‑marketplace only. If you were expecting different files (from a separate project), they are not present here; let me know and I can look into the correct repository.

---

## 9. ✅ Verification performed (all passed)

**Build & types**
- `tsc --noEmit` — **0 type errors**
- `npm run build` — **builds successfully**, PWA assets copied to `dist/`

**Server**
- Boots and now respects `process.env.PORT` (verified by booting with `PORT=8080`)
- Health, market prices, MSP, AI chat, products, buyer requests, offers, orders, conversations, alerts, logistics, notifications, and admin endpoints all return valid JSON

**Full end-to-end API smoke test (every functional variable present)**
- Demo login for farmer / buyer / admin → valid JWT
- Public endpoints: `/api/health`, `/markets/prices`, `/markets/crops/:crop`, `/markets/msp`, `/markets/net-return`, `/products`, `/buyer-requests`, `/ai/chat` — all `success: true`
- Auth endpoints: `/auth/me`, `/offers`, `/orders`, `/conversations`, `/alerts`, `/notifications`, `/logistics` — all `success: true`
- Admin endpoints: `/admin/stats`, `/admin/users`, `/admin/disputes` — all `success: true`
- Matching: `/products/:id/matching-requests`, `/buyer-requests/:id/matching-farmers` — return matches
- **Full transaction flow**: create buyer request → create produce → create offer → buyer accepts offer (auto‑creates order + conversation) → escrow `deposit` → `mark_delivered` → `verify_quality` → `release` (payment status → `released`) ✅
- Chat message send, price‑alert create/toggle, logistics task create/status — all `success: true`

**PWA / mobile**
- Manifest, service worker, app icons, OG image all served with HTTP 200
- `VITE_API_BASE_URL` correctly baked into the bundle when set (defaults to same‑origin `/api`)
- Capacitor Android project generated with branded launcher icons and web assets synced

---

## 10. 🙋 What I need from you (to finish the APK)

Sandbox can't reach Android build servers, so the compile step happens on **your** machine. Please confirm/provide:

1. **Deployed Render URL** — have you deployed Kisan Mitra to Render yet? If yes, paste the URL (e.g. `https://xxxx.onrender.com`). If not, I can walk you through the Render deploy (Section 2).
2. **Do you have Android Studio installed, or would you prefer the zero‑code PWABuilder route?** (PWABuilder needs no install; Capacitor needs Android Studio.)
3. **Wanted APK format:** debug APK is fine to sideload for a hackathon demo (no signing needed). If you need a **release/signed** APK, you'll set up a keystore on your machine (I can provide the commands).

With options 1–3 answered, you (or I, if given your machine's environment) can run the one command to produce `.apk`:

```bash
VITE_API_BASE_URL="https://your-app.onrender.com" npm run build \
  && npx cap sync android \
  && (cd android && ./gradlew assembleDebug)
# → android/app/build/outputs/apk/debug/app-debug.apk
```
