import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { glob } from 'glob';

const routesDir = path.resolve('./src/routes');
const outFileName = 'types.gen.ts';

type RouteInfo = {
  filePath: string;
  method: string;
  url: string;
};

async function scanRoutes(): Promise<string[]> {
  const result = await glob('./src/routes/**/*.ts');

  return result
    .filter((filePath) => !filePath.endsWith(outFileName))
    .toSorted();
}

async function transformRoute(filePath: string): Promise<RouteInfo> {
  const moduleValue = (await import(pathToFileURL(filePath).href)) as {
    default: { method: string; url: string };
  };

  const { method, url } = moduleValue.default;

  return { filePath, method: method, url };
}

function createMetaFileContent(routes: RouteInfo[]) {
  const routesArray = routes.map(({ filePath, method, url }) => {
    const relative = path.relative(routesDir, filePath).replaceAll('\\', '/');
    const jsFile = relative.replace('.ts', '.js');

    return `    '${method} ${url}': typeof import('./${jsFile}');`;
  });

  let result = `import '@game-cms/core/api';\n\n`;
  result += `declare module '@game-cms/core/api' {\n`;
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
