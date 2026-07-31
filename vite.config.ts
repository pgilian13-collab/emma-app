import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@components': path.resolve(__dirname, './src/components'),
      '@store': path.resolve(__dirname, './src/store'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@app-types': path.resolve(__dirname, './src/types'),
      jsmediatags: path.resolve(
        __dirname,
        './node_modules/jsmediatags/dist/jsmediatags.min.js',
      ),
    },
  },
  optimizeDeps: {
    exclude: ['jsmediatags'],
  },
  server: {
    port: 5173,
    open: true,
  },
});