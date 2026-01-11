import fsp from 'node:fs/promises';
import path from 'node:path';

import { MIGRATIONS_DIRECTORY_PATH } from '../../services/migration.js';

export default async function run(name?: string) {
  const prefix = new Date().toISOString().slice(0, -5).replaceAll(':', '.');

  const fileName = name ? `${prefix}-${name}` : prefix;
  const filePath = path.join(MIGRATIONS_DIRECTORY_PATH, `${fileName}.ts`);

  const content = `export default async function execute() {}\n`;

  await fsp.mkdir(path.dirname(filePath), { recursive: true });
  await fsp.writeFile(filePath, content, 'utf8');
}
