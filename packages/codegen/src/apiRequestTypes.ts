import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

import { importFile } from '@game-cms/shared';
import type { HttpMethod, UnknownApiRoute } from '@game-cms/types';

const routesDir = path.resolve('./src/routes');
const outFileName = 'types.gen.ts';

type RouteInfo = {
  filePath: string;
  method: HttpMethod;
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
  const { method, url } = moduleValue.default;

  return { filePath, method: method as HttpMethod, url };
}

function createMetaFileContent(routes: RouteInfo[]) {
  const routesArray = routes.map(({ filePath, method, url }) => {
    const relative = path.relative(routesDir, filePath);
    const jsFile = relative.replace('.ts', '.js');

    return `'${method} ${url}': typeof import('./${jsFile}')`;
  });

  let result = `declare module '@game-cms/types' {\n`;
  result += `  interface ApiRouteMap {\n`;
  result += routesArray.join('    \n');
  result += `\n  }\n`;
  result += '}\n';

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
