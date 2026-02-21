import fsp from 'node:fs/promises';
import path from 'node:path';

import { cms } from '@game-cms/global';
import type { MaybePromise } from '@game-cms/shared';
import { removeExtension } from '@game-cms/shared/node';
import { createJiti, type Jiti } from 'jiti';

type MigrationEntry = { name: string };

type MigrationFn = () => MaybePromise<void>;

declare module '@game-cms/base-core' {
  interface DatabaseEntityMap {
    'base::migrations': MigrationEntry;
  }
}

export const MIGRATIONS_DIRECTORY_PATH = './src/migrations';

async function listMigrations() {
  const result = await fsp.readdir(MIGRATIONS_DIRECTORY_PATH);

  return result
    .filter((value) => value.endsWith('.ts'))
    .toSorted((a, b) => a.localeCompare(b))
    .map((value) => removeExtension(value));
}

async function executeMigration(name: string, jiti: Jiti) {
  const fn = await jiti.import<MigrationFn>(
    path.resolve(path.join(MIGRATIONS_DIRECTORY_PATH, `${name}.ts`)),
    {
      default: true,
    }
  );

  await fn();
}

export async function executeRemainingMigrations() {
  const executedMigrations = await cms()
    .service('base::database')
    .collection('base::migrations')
    .find()
    .toArray();

  const allMigrations = await listMigrations();

  const remainingMigrations = allMigrations.filter(
    (name) => !executedMigrations.some((entry) => entry.name == name)
  );

  const jiti = createJiti(import.meta.url);

  for (const name of remainingMigrations) {
    await executeMigration(name, jiti);

    await cms()
      .service('base::database')
      .collection('base::migrations')
      .insertOne({ name });
  }
}
