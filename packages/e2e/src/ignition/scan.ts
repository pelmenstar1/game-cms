import { glob } from 'glob';
import { createJiti } from 'jiti';

export async function importTests(rootDir: string) {
  const files = await glob('**/*e2e-test.ts', {
    ignore: ['**/node_modules/**', '**/dist/**'],
    cwd: rootDir,
    absolute: true,
  });

  const jiti = createJiti(import.meta.url);

  await Promise.all(files.map((file) => jiti.import(file)));
}
