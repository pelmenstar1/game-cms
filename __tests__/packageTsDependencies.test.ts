import fsp from 'node:fs/promises';
import path from 'node:path';

import { expect, test } from 'vitest';

import {
  PackageInfo,
  readPackageInfo,
  readTsConfig,
  TsConfig,
} from '../packages/shared/src/node';
import { packagesDir, tsConfigImplicitDependencies } from '../shared/constants';

type PackageRegistry = Awaited<ReturnType<typeof createPackageRegistry>>;

const exceptions = new Set(['dashboard']);

function getWorkspaceDependencies(info: PackageInfo) {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  function worker(deps: Record<string, string>) {
    return Object.keys(deps).filter((name) => name.startsWith('@game-cms/'));
  }

  return [
    ...(info.dependencies ? worker(info.dependencies) : []),
    ...(info.devDependencies ? worker(info.devDependencies) : []),
  ];
}

async function createPackageRegistry() {
  const packages = await fsp.readdir(packagesDir);
  const packagesInfos = await Promise.all(
    packages.map(async (name) => {
      try {
        return {
          directoryName: name,
          info: await readPackageInfo(path.join(packagesDir, name)),
        };
      } catch (error) {
        throw new Error(`Invalid package.json in ${name}`, { cause: error });
      }
    })
  );

  return {
    packages,
    getPackageDirectory: (packageName: string) => {
      const info = packagesInfos.find(({ info }) => info.name === packageName);

      return info?.directoryName;
    },
  };
}

function getActualReferences(rootDir: string, tsConfig: TsConfig) {
  const name = path.basename(rootDir);
  const exceptions = tsConfigImplicitDependencies[name] ?? [];

  let result = tsConfig.references?.map(({ path }) => path) ?? [];
  result = result.filter((value) => !exceptions.includes(value));

  return new Set(result);
}

async function checkPackage(rootDir: string, registry: PackageRegistry) {
  const [packageInfo, tsConfig] = await Promise.all([
    readPackageInfo(rootDir),
    readTsConfig(rootDir),
  ]);

  const workspaceDeps = getWorkspaceDependencies(packageInfo);
  const expectedReferences = workspaceDeps
    .map((name) => registry.getPackageDirectory(name))
    .filter((name) => name !== undefined && !exceptions.has(name))
    .map((name) => `../${name}`);

  const actualReferences = getActualReferences(rootDir, tsConfig);

  expect(actualReferences, rootDir).toEqual(new Set(expectedReferences));
}

test('check typescript dependencies', async () => {
  const registry = await createPackageRegistry();

  await Promise.all(
    registry.packages.map((name) =>
      checkPackage(path.join(packagesDir, name), registry)
    )
  );
});
