import path from 'node:path';

import { importTests, runTests } from '@game-cms/e2e/ignition';

import { setupCms } from './setup.js';

export async function run() {
  await setupCms();

  const rootDir = path.join(import.meta.dirname, '../../');

  await importTests(rootDir);
  await runTests();

  process.exit(0);
}

void run();
