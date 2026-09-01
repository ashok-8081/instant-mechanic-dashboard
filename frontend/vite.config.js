import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Skip type checking during build
    rollupOptions: {
      // ... your rollup options
    }
  },
  // This tells Vite to ignore TypeScript errors
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
});