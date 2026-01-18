import fsp from 'node:fs/promises';
import path from 'node:path';

import { expect, test } from 'vitest';

import { readJson, readJson5 } from '../packages/shared/src/io/file';
import { TsConfig } from './types';

type PackageInfo = {
  name: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

type PackageRegistry = Awaited<ReturnType<typeof createPackageRegistry>>;

const exceptions = new Set(['dashboard']);

const packagesDir = path.join(import.meta.dirname, '../packages');

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
          info: await readJson<PackageInfo>(
            path.join(packagesDir, name, 'package.json')
          ),
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

async function checkPackage(rootDir: string, registry: PackageRegistry) {
  const [packageInfo, tsConfig] = await Promise.all([
    readJson<PackageInfo>(path.join(rootDir, 'package.json')),
    readJson5<TsConfig>(path.join(rootDir, 'tsconfig.json')),
  ]);

  const workspaceDeps = getWorkspaceDependencies(packageInfo);
  const expectedReferences = workspaceDeps
    .map((name) => registry.getPackageDirectory(name))
    .filter((name) => name !== undefined && !exceptions.has(name))
    .map((name) => `../${name}`);

  const actualReferences = tsConfig.references?.map(({ path }) => path) ?? [];

  expect(new Set(actualReferences), rootDir).toEqual(
    new Set(expectedReferences)
  );
}

test('check typescript dependencies', async () => {
  const registry = await createPackageRegistry();

  await Promise.all(
    registry.packages.map((name) =>
      checkPackage(path.join(packagesDir, name), registry)
    )
  );
});
