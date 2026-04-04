import fsp from 'node:fs/promises';
import path from 'node:path';

import { format, resolveConfig } from 'prettier';

import { readJson5, readPackageInfo } from '../packages/shared/src/node';
import { packagesDir, tsConfigImplicitDependencies } from '../shared/constants';
import { getWorkspacePackageNames } from '../shared/workspace';

type TsConfig = {
  references?: {
    path: string;
  }[];
};

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

async function getWorkspaceDependencies(
  baseDir: string,
  workspacePackageNames: Set<string>
) {
  const packageInfo = await readPackageInfo(baseDir);

  const keys = [
    ...Object.keys(packageInfo.dependencies ?? {}),
    ...Object.keys(packageInfo.devDependencies ?? {}),
  ];

  return keys
    .filter((name) => workspacePackageNames.has(name) && !exceptions.has(name))
    .map((name) => path.basename(name))
    .toSorted();
}

async function getTsConfigReferences(
  baseDir: string,
  workspacePackageNames: Set<string>
) {
  const deps = await getWorkspaceDependencies(baseDir, workspacePackageNames);

  const name = path.basename(baseDir);
  const refs = deps.map((name) => ({ path: `../${name}` }));

  const implicitRefs = (tsConfigImplicitDependencies[name] ?? []).map(
    (path) => ({ path })
  );

  return [...refs, ...implicitRefs];
}

async function processPackage(
  baseDir: string,
  prettier: PrettierApi,
  workspacePackageNames: Set<string>
) {
  const configPath = path.join(baseDir, 'tsconfig.json');
  const config = await readJson5<TsConfig>(configPath);

  const refs = await getTsConfigReferences(baseDir, workspacePackageNames);
  config.references = refs.length > 0 ? refs : undefined;

  const output = await prettier.format(JSON.stringify(config));

  await fsp.writeFile(configPath, output, 'utf8');
}

async function main() {
  const prettier = await prettierApi();

  const workspacePackageNames = await getWorkspacePackageNames();

  const packageEntries = await fsp.readdir(packagesDir, {
    withFileTypes: true,
  });

  await Promise.all(
    packageEntries
      .filter((entry) => entry.isDirectory())
      .map((entry) =>
        processPackage(
          path.join(packagesDir, entry.name),
          prettier,
          workspacePackageNames
        )
      )
  );
}

void main();
