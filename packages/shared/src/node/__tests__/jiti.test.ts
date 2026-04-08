import path from 'node:path';

import { createJiti } from 'jiti';
import { describe } from 'vitest';

import { maybeJitiImport } from '../jiti.js';
import { describeImportBehavior } from './helpers/importBehavior.js';

function fixture(name: string) {
  return `./fixtures/${name}`;
}

const jiti = createJiti(import.meta.url);

describe('maybeJitiImport', () => {
  const opts = {
    importFn: (p: string) => maybeJitiImport(jiti, p),
    paths: {
      existing: ['../buffer.ts', fixture('defaultExport.js')],
      throwing: fixture('throwingModule.js'),
      unknown: fixture('nonExistentModule.js'),
      importNonExistent: fixture('importNonExistentFile.js'),
    },
  };

  describeImportBehavior('relative paths', opts);
  describeImportBehavior('absolute paths', {
    ...opts,
    resolvePath: (p) => path.resolve(import.meta.dirname, p),
  });
});
