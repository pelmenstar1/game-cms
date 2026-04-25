import path from 'node:path';

import { importTests, runTests } from '@game-cms/e2e/ignition';
import { destroyServices } from '@game-cms/ignition';
import minimist from 'minimist';

import { setupCms } from './setup.js';

const rootDir = path.join(import.meta.dirname, '../../');

type Argv = {
  filter?: string;
  t?: string;
  noCheck?: boolean;
};

export async function run() {
  const argv = minimist<Argv>(process.argv.slice(2), {
    string: ['filter', 't'],
    boolean: ['noCheck'],
  });

  const filterPattern = argv.filter ?? argv.t;

  try {
    await setupCms({ noCheck: argv.noCheck });
    await importTests(rootDir);
    await runTests({ filterPattern });
  } finally {
    try {
      await destroyServices();
    } catch (error) {
      console.error('Error during shutdown:', error);
    }
  }
}

void run();
