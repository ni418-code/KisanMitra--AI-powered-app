/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Absolute base URL of the Kisan Mitra backend API.
   * - Leave unset (`/api`) when serving the web app from the same origin (Render).
   * - Set to your deployed URL (e.g. https://your-app.onrender.com) when building
   *   the Android APK with Capacitor, so the app can reach the backend.
   */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
