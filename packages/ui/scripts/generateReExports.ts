import fsp from 'node:fs/promises';
import path from 'node:path';

async function processDirectory(dirPath: string) {
  const entries = await fsp.readdir(dirPath, { withFileTypes: true });

  const exports = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => `export * from './${entry.name}';`)
    .toSorted();

  const fileContent = `${exports.join('\n')}\n`;

  await fsp.writeFile(path.join(dirPath, 'index.ts'), fileContent, 'utf8');
}

async function main() {
  const dirs = ['components', 'icons'];

  await Promise.all(
    dirs.map((name) =>
      processDirectory(path.join(import.meta.dirname, '../src', name))
    )
  );
}

void main();
