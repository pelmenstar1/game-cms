import { randomUUID } from 'node:crypto';
import fsp from 'node:fs/promises';
import path from 'node:path';

import { temporalDirectory } from '@game-cms/shared/node/io';
import { setupStorageProviderTests } from '@game-cms/testing-lib';
import { describe } from 'vitest';

import { localStorageProvider } from './index.js';

describe('localStorageProvider', () => {
  setupStorageProviderTests({
    disallowNonExistingPatch: true,
    createProvider: async () => {
      const result = await temporalDirectory();

      return {
        value: localStorageProvider({ storagePath: result.path }),
        path: result.path,
        [Symbol.asyncDispose]: result[Symbol.asyncDispose],
      };
    },
    exists: async (provider, extra) => {
      try {
        await fsp.access(path.join(provider.path, extra.fileName));
        return true;
      } catch {
        return false;
      }
    },
    nonExistingExtra: () => ({ fileName: randomUUID() }),
  });
});
