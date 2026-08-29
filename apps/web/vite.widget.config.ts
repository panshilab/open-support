import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/widget.ts',
      formats: ['iife'],
      name: 'OpenSupportWidget',
      fileName: () => 'chat-widget.js',
    },
    outDir: 'dist/widget',
    emptyOutDir: false,
  },
});
