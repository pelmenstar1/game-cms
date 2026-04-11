import { glob } from 'glob';
import { createJiti } from 'jiti';

import { setCurrentFile } from '../internal/suite.js';

export async function importTests(rootDir: string) {
  const files = await glob('**/*e2e-test.ts', {
    ignore: ['**/node_modules/**', '**/dist/**'],
    cwd: rootDir,
    absolute: true,
  });

  const jiti = createJiti(import.meta.url);

  for (const file of files) {
    setCurrentFile(file);
    await jiti.import(file);
  }
}
