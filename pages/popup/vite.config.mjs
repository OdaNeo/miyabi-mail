import { resolve } from 'node:path';
import { withPageConfig } from '@extension/vite-config';

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, 'src');

export default withPageConfig({
  resolve: {
    alias: {
      '@src': srcDir,
    },
  },
  publicDir: resolve(rootDir, 'public'),
  build: {
    outDir: resolve(rootDir, '..', '..', 'dist', 'popup'),
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
    coverage: {
      exclude: ['**/src/components/ui/**'],
      include: ['**/src/**'],
    },
  },
});
