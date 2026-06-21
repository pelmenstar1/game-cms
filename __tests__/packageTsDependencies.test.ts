import path from 'node:path';

import { expect, test } from 'vitest';

import {
  PackageInfo,
  readPackageInfo,
  readTsConfig,
  TsConfig,
} from '../packages/shared/src/node';
import { tsConfigImplicitDependencies } from '../shared/constants';
import { getWorkspacePackages } from '../shared/workspace';

type PackageRegistry = Awaited<ReturnType<typeof createPackageRegistry>>;

const ignoredPackages: Record<string, string[]> = {
  'demo-app': ['@game-cms/game-plugin'],
};

function getWorkspaceDependencies(
  info: PackageInfo,
  registry: PackageRegistry
) {
  function worker(deps: Record<string, string>) {
    return Object.keys(deps).filter((name) =>
      registry.isWorkspacePackage(name)
    );
  }

  return [
    ...(info.dependencies ? worker(info.dependencies) : []),
    ...(info.devDependencies ? worker(info.devDependencies) : []),
  ];
}

async function createPackageRegistry() {
  const packageDirs = await getWorkspacePackages();

  const packagesInfos = await Promise.all(
    packageDirs.map(async (directoryPath) => {
      try {
        return {
          directoryPath,
          info: await readPackageInfo(directoryPath),
        };
      } catch (error) {
        throw new Error(`Invalid package.json in ${directoryPath}`, {
          cause: error,
        });
      }
    })
  );

  const tsConfigs = await Promise.all(
    packageDirs.map(async (dirPath) => {
      return {
        directoryPath: dirPath,
        config: await readTsConfig(dirPath),
      };
    })
  );

  return {
    packages: packageDirs,
    isWorkspacePackage: (packageName: string) => {
      return packagesInfos.some(({ info }) => info.name === packageName);
    },
    getPackageDirectory: (packageName: string) => {
      const info = packagesInfos.find(({ info }) => info.name === packageName);

      return info?.directoryPath;
    },
    hasNoEmit: (dirPath: string) => {
      const tsConfig = tsConfigs.find(
        ({ directoryPath }) => directoryPath === dirPath
      )?.config;

      return tsConfig?.compilerOptions?.noEmit ?? false;
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

function isExpectedReference(
  dirPath: string | undefined,
  registry: PackageRegistry
) {
  if (dirPath === undefined) {
    return false;
  }

  return !registry.hasNoEmit(dirPath);
}

async function checkPackage(rootDir: string, registry: PackageRegistry) {
  const [packageInfo, tsConfig] = await Promise.all([
    readPackageInfo(rootDir),
    readTsConfig(rootDir),
  ]);

  const ignored = ignoredPackages[packageInfo.name] ?? [];
  const workspaceDeps = getWorkspaceDependencies(packageInfo, registry);

  const expectedReferences = workspaceDeps
    .filter((name) => !ignored.includes(name))
    .map((name) => registry.getPackageDirectory(name))
    .filter((name): name is string => isExpectedReference(name, registry))
    .map((name) => path.relative(rootDir, name).replaceAll('\\', '/'));

  const actualReferences = getActualReferences(rootDir, tsConfig);

  expect(actualReferences, rootDir).toEqual(new Set(expectedReferences));
}

test('check typescript dependencies', async () => {
  const registry = await createPackageRegistry();

  await Promise.all(
    registry.packages.map((dirPath) => checkPackage(dirPath, registry))
  );
});
