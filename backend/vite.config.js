// backend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    manifest: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.js'),
        hauntedhouse: '@/components/HauntedHouse.js',
      },
    },
  },
});