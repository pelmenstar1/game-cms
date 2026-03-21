import fsp from 'node:fs/promises';
import path from 'node:path';

import { format, resolveConfig } from 'prettier';

import { readJson5, readPackageInfo } from '../packages/shared/src/node';
import { packagesDir, tsConfigImplicitDependencies } from '../shared/constants';

type TsConfig = {
  references?: {
    path: string;
  }[];
};

const WORKSPACE_PREFIX = '@game-cms/';

const exceptions = new Set(['@game-cms/dashboard']);

type PrettierApi = Awaited<ReturnType<typeof prettierApi>>;

async function prettierApi() {
  const config = await resolveConfig('.', {
    config: path.join(import.meta.dirname, '../prettier.config.js'),
  });

  return {
    format: (text: string) => format(text, { parser: 'json', ...config }),
  };
}

async function getWorkspaceDependencies(baseDir: string) {
  const packageInfo = await readPackageInfo(baseDir);

  const keys = [
    ...Object.keys(packageInfo.dependencies ?? {}),
    ...Object.keys(packageInfo.devDependencies ?? {}),
  ];

  return keys
    .filter(
      (name) => name.startsWith(WORKSPACE_PREFIX) && !exceptions.has(name)
    )
    .map((name) => {
      const [, actualName] = name.split(WORKSPACE_PREFIX);

      return actualName;
    })
    .toSorted();
}

async function getTsConfigReferences(baseDir: string) {
  const deps = await getWorkspaceDependencies(baseDir);

  const name = path.basename(baseDir);
  const refs = deps.map((name) => ({ path: `../${name}` }));

  const implicitRefs = (tsConfigImplicitDependencies[name] ?? []).map(
    (path) => ({ path })
  );

  return [...refs, ...implicitRefs];
}

async function processPackage(baseDir: string, prettier: PrettierApi) {
  const configPath = path.join(baseDir, 'tsconfig.json');
  const config = await readJson5<TsConfig>(configPath);

  const refs = await getTsConfigReferences(baseDir);
  config.references = refs.length > 0 ? refs : undefined;

  const output = await prettier.format(JSON.stringify(config));

  await fsp.writeFile(configPath, output, 'utf8');
}

async function main() {
  const prettier = await prettierApi();

  const packageEntries = await fsp.readdir(packagesDir, {
    withFileTypes: true,
  });

  await Promise.all(
    packageEntries
      .filter((entry) => entry.isDirectory())
      .map((entry) =>
        processPackage(path.join(packagesDir, entry.name), prettier)
      )
  );
}

void main();
