import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

import tsconfigPaths from 'vite-tsconfig-paths';
import { loadEnv } from 'vite';

const env = loadEnv('', './packages/website', '');

const plugins = [react(), tsconfigPaths()];

export default defineConfig({
  plugins,
  test: {
    pool: 'threads',
    coverage: {
      exclude: ['**/storybook-static'],
    },
    projects: [
      {
        plugins,
        test: {
          include: ['**/*.test.ts'],
          name: 'unit',
          env,
          environment: 'node',
        },
      },
      {
        plugins,
        test: {
          include: ['**/*.btest.{ts,tsx}'],
          name: 'browser',
          env,
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
