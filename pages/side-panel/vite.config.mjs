/// <reference types="vitest" />
/// <reference types="vitest/config" />

import { resolve } from 'node:path';
import { withPageConfig } from '@extension/vite-config';

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, 'src');

export default withPageConfig({
  resolve: {
    alias: {
      '@': srcDir,
    },
  },
  publicDir: resolve(rootDir, 'public'),
  build: {
    outDir: resolve(rootDir, '..', '..', 'dist', 'side-panel'),
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/i18n/')) {
            return 'i18n';
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./setup-vitest.ts','fake-indexeddb/auto'],
    coverage: {
      include: ['**/src/**'],
    },
  },
});
