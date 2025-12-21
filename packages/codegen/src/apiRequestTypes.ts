import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

import { importFile } from '@game-cms/shared/io';
import type { HttpMethod, UnknownApiRoute } from '@game-cms/types';
import { glob } from 'glob';

const routesDir = path.resolve('./src/routes');
const outFileName = 'types.gen.ts';

type RouteInfo = {
  filePath: string;
  method: HttpMethod;
  url: string;
};

async function scanRoutes(): Promise<string[]> {
  const result = await glob('./src/routes/**/*.ts');

  return result
    .filter((filePath) => !filePath.endsWith(outFileName))
    .toSorted();
}

async function transformRoute(filePath: string): Promise<RouteInfo> {
  const moduleValue = await importFile<{ default: UnknownApiRoute }>(filePath);
  const { method, url } = moduleValue.default;

  return { filePath, method: method as HttpMethod, url };
}

function createMetaFileContent(routes: RouteInfo[]) {
  const routesArray = routes.map(({ filePath, method, url }) => {
    const relative = path.relative(routesDir, filePath).replaceAll('\\', '/');
    const jsFile = relative.replace('.ts', '.js');

    return `    '${method} ${url}': typeof import('./${jsFile}');`;
  });

  let result = `declare module '@game-cms/types' {\n`;
  result += `  interface ApiRouteMap {\n`;
  result += routesArray.join('\n');
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
