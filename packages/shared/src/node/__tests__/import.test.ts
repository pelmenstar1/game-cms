import path from 'node:path';

import { maybeImportFile } from '../import.js';
import { describeImportBehavior } from './helpers/importBehavior.js';

function fixture(name: string) {
  return path.join(import.meta.dirname, 'fixtures', name);
}

describeImportBehavior('maybeImportFile', {
  importFn: maybeImportFile,
  paths: {
    existing: fixture('target.js'),
    throwing: fixture('throwingModule.js'),
    unknown: fixture('nonExistentModule.js'),
    importNonExistent: fixture('importNonExistentFile.js'),
  },
});
