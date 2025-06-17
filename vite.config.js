import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: '/Kody-James-Portfolio/',
  plugins: [react()],
  server: {
    fs: {
      allow: ['..'],
    },
  },
  assetsInclude: ['**/_*.py'], // Include files starting with underscore
});
