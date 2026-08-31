import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kisanmitra.app',
  appName: 'Kisan Mitra',
  webDir: 'dist',
  // The marketing page and app are served from the same origin.
  // Keep server.url unset so this builds a fully-standalone offline-capable app.
  server: {
    androidScheme: 'https',
  },
};

export default config;
