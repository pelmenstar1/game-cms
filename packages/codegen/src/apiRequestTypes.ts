import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

import { importFile } from '@game-cms/shared';
import type { UnknownApiRoute } from '@game-cms/types';

const routesDir = path.resolve('./src/routes');
const outFileName = 'types.gen.ts';

type RouteInfo = {
  filePath: string;
  url: string;
};

async function scanRoutes(): Promise<string[]> {
  async function worker(baseDir: string): Promise<string[]> {
    const entries = await fsp.readdir(baseDir, { withFileTypes: true });

    const result = await Promise.all(
      entries.map(async (entry) => {
        const { name } = entry;
        const entryPath = path.join(baseDir, name);

        if (entry.isDirectory()) {
          return worker(entryPath);
        } else if (
          entry.isFile() &&
          name.endsWith('.ts') &&
          name !== outFileName
        ) {
          return [entryPath];
        }

        return [];
      })
    );

    return result.flat();
  }

  return worker(routesDir);
}

async function transformRoute(filePath: string): Promise<RouteInfo> {
  const moduleValue = await importFile<{ default: UnknownApiRoute }>(filePath);

  return { filePath, url: moduleValue.default.url };
}

function createMetaFileContent(routes: RouteInfo[]) {
  const routesArray = routes.map(({ filePath, url }) => {
    const relative = path.relative(routesDir, filePath);
    const jsFile = relative.replace('.ts', '.js');

    return `{ url: '${url}', exported: typeof import('./${jsFile}')}`;
  });

  let result = `import type { ResolveRouteMetaArray } from '@game-cms/types';\n`;
  result += '\n';
  result += `export type Meta = ResolveRouteMetaArray<[${routesArray.join(', ')}]>;`;

  return result;
}

async function main() {
  if (!fs.existsSync(routesDir)) {
    throw new Error(`Expected ${routesDir} to exist`);
  }

  const routes = await scanRoutes();
  const routeInfos = await Promise.all(
    routes.map((filePath) => transformRoute(filePath))
  );

  const outContent = createMetaFileContent(routeInfos);

  await fsp.writeFile(path.join(routesDir, outFileName), outContent, 'utf8');
}

void main();
