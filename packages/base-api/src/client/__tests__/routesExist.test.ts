import fsp from 'node:fs/promises';
import path from 'node:path';

import { isNonNullObject } from '@game-cms/shared';
import { filterOutNullable } from '@game-cms/shared/collections';
import { glob } from 'glob';
import { createJiti, Jiti } from 'jiti';
import { expect, test } from 'vitest';

const routesDir = path.resolve(import.meta.dirname, '../../routes');
const requestsDir = path.resolve(import.meta.dirname, '../requests');

function normalizeUrl(url: string): string {
  return url
    .replaceAll(/:[a-zA-Z_$][a-zA-Z0-9_$]*/g, '*') // Express :param
    .replaceAll(/\$\{[^}]+\}/g, '*'); // Template ${expr}
}

async function getRegisteredRoute(jiti: Jiti, filePath: string) {
  const module = await jiti.import<{
    default?: unknown;
  }>(filePath);

  const { default: defaultExport } = module;

  if (isNonNullObject(defaultExport)) {
    const { method, url } = defaultExport;

    if (typeof method === 'string' && typeof url === 'string') {
      return `${method} ${normalizeUrl(url)}`;
    }
  }
}

async function getRegisteredRoutes() {
  const routeFiles = await glob('**/*.ts', { cwd: routesDir, absolute: true });
  const jiti = createJiti(import.meta.dirname);

  const results = await Promise.all(
    routeFiles.map((filePath) => getRegisteredRoute(jiti, filePath))
  );

  return new Set(filterOutNullable(results));
}

async function extractClientRequests(filePath: string) {
  const content = await fsp.readFile(filePath, 'utf8');
  const results: Array<{ method: string; url: string }> = [];

  const chunks = content.split(/\brequest\s*\(/);
  chunks.shift();

  for (const chunk of chunks) {
    const block = chunk.slice(0, 600).replaceAll(/\s+/g, ' ');
    let url: string | null = null;
    let match: RegExpMatchArray | null;

    // url: url({ ... path: `template` ... })
    match = block.match(/url\s*:\s*url\s*\([\s\S]*?path\s*:\s*`([^`]*)`/);
    if (match) url = match[1];

    // url: url({ ... path: 'static' ... })
    if (!url) {
      match = block.match(/url\s*:\s*url\s*\([\s\S]*?path\s*:\s*'([^']*)'/);
      if (match) url = match[1];
    }

    // url: `template`
    if (!url) {
      match = block.match(/url\s*:\s*`([^`]*)`/);
      if (match) url = match[1];
    }

    // url: 'static'
    if (!url) {
      match = block.match(/url\s*:\s*'([^']*)'/);
      if (match) url = match[1];
    }

    if (!url?.startsWith('/')) continue;

    match = block.match(/method\s*:\s*'([A-Z]+)'/);
    const method = match ? match[1] : 'GET';

    results.push({ method, url });
  }

  return results;
}

async function getRequestFiles() {
  const allFiles = await glob('**/*.ts', { cwd: requestsDir, absolute: true });

  return allFiles.filter((f) => path.basename(f) !== 'index.ts');
}

test('all client requests point to registered routes', async () => {
  const [registeredRoutes, requestFiles] = await Promise.all([
    getRegisteredRoutes(),
    getRequestFiles(),
  ]);

  const mismatches = await Promise.all(
    requestFiles.map(async (filePath) => {
      const relPath = path.relative(requestsDir, filePath);
      const clientRequests = await extractClientRequests(filePath);

      const mismatches: string[] = [];

      for (const { method, url } of clientRequests) {
        const normalized = `${method} ${normalizeUrl(url)}`;

        if (!registeredRoutes.has(normalized)) {
          mismatches.push(`${relPath}: ${method} ${url}`);
        }
      }

      return mismatches;
    })
  );

  expect(mismatches.flat()).toEqual([]);
});
