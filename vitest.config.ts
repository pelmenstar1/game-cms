import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

import tsconfigPaths from 'vite-tsconfig-paths';

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
          environment: 'node',
        },
      },
      {
        plugins,
        test: {
          include: ['**/*.outer-loop-test.ts'],
          name: 'outer-loop',
          environment: 'node',
        },
      },
      {
        plugins,
        test: {
          include: ['**/*.btest.{ts,tsx}'],
          name: 'browser',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
      {
        plugins,
        test: {
          include: ['**/*.e2e-test.ts'],
          setupFiles: ['packages/e2e/src/globalSetup.ts'],
          name: 'e2e',
          environment: 'node',
        },
      },
    ],
  },
});
