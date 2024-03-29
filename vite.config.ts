import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      // '@/': `${__dirname}/src/`,
      // '~/': `${__dirname}/public/`,
      '@frontend/': `${__dirname}/src/`,
      'src/': `${__dirname}/src/`,
    },
  },
  plugins: [react()],
});
