/* eslint-disable no-console */
import path from 'node:path';
import { createInterface } from 'node:readline/promises';

import { cms, setLogger } from '@game-cms/global';
import {
  destroyServices,
  initEnvFromConfigs,
  initServices,
} from '@game-cms/ignition';
import pino from 'pino';

export type SetupCmsOptions = {
  noCheck?: boolean;
};

async function ensureDatabaseIsEmpty(options?: SetupCmsOptions) {
  const databaseService = cms().service('base::database');

  const isEmpty = await databaseService.isDatabaseEmpty();
  if (!isEmpty) {
    console.warn('Database is not empty');

    if (process.stdout.isTTY && !options?.noCheck) {
      const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const answer = await rl.question(
        'The database needs to be emptied (y/n) '
      );

      if (answer.toLowerCase() === 'n') {
        process.exit(1);
      }

      rl.close();
    }

    console.log('Emptying database...');
    await databaseService.dropDatabase();
  }
}

export async function setupCms(options?: SetupCmsOptions) {
  await initEnvFromConfigs(path.join(import.meta.dirname, '../'));
  setLogger(pino());

  await ensureDatabaseIsEmpty(options);
  await initServices();
}

export async function destroyCms() {
  await destroyServices();
}
