import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const apiOrigin = process.env.API_ORIGIN ?? 'http://localhost:7001';

export default defineConfig({
  server: {
    port: 7000,
    proxy: {
      '/api': {
        target: apiOrigin,
        changeOrigin: true,
      },
      '/uploads': {
        target: apiOrigin,
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 7000,
    strictPort: true,
    proxy: {
      '/api': {
        target: apiOrigin,
        changeOrigin: true,
      },
      '/uploads': {
        target: apiOrigin,
        changeOrigin: true,
      },
    },
  },
  plugins: [tanstackStart(), viteReact()],
});
