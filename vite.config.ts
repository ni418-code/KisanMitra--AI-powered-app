import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      // Split the heavy vendor libraries so the browser can cache them
      // separately and the first paint is not blocked by a 1 MB bundle.
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return undefined;
            if (/node_modules\/(react|react-dom|scheduler|use-sync-external-store)\//.test(id)) return 'react';
            if (/node_modules\/(motion|framer-motion)\//.test(id)) return 'motion';
            if (/node_modules\/(recharts|d3-|victory|internmap|delaunator|robust-predicates)\//.test(id)) return 'charts';
            if (/node_modules\/(socket\.io-client|engine\.io-client|@socket\.io)\//.test(id)) return 'socket';
            if (/node_modules\/(lucide-react)\//.test(id)) return 'icons';
            return undefined;
          },
        },
      },
    },
    server: {
      allowedHosts: ['.e2b.app', 'localhost', '127.0.0.1'],
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
