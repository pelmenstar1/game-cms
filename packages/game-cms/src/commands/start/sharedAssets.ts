import type { SharedAssetDerivativeMap } from '@game-cms/build';
import { mergeObjects } from '@game-cms/shared/object';
import type { SharedAssetsConfig } from '@game-cms/types';
import path from 'node:path';
import {
  getViteManifest,
  traceEntryPointJsDependencies,
} from '../../utils/viteManifest.js';
import { fileURLToPath } from 'node:url';
import { removeExtension } from '@game-cms/shared/string';

type PackageWithBundle = { name: string; bundle: string };

const redirects: Partial<SharedAssetDerivativeMap<PackageWithBundle>> = {
  react: {
    react: { name: '@game-cms/react', bundle: 're-react' },
    'react-dom': { name: '@game-cms/react/dom', bundle: 're-react-dom' },
    'react/jsx-runtime': {
      name: '@game-cms/react/jsx-runtime',
      bundle: 're-react-jsx-runtime',
    },
  },
};

async function resolvePackageWithBundle(
  key: string,
  info: PackageWithBundle
): Promise<Record<string, string>> {
  const targetPath = fileURLToPath(import.meta.resolve(info.name));
  const directoryPath = path.dirname(targetPath);

  const manifest = await getViteManifest(directoryPath);
  const entry = Object.values(manifest).find(
    ({ name }) => name === info.bundle
  );
  if (entry === undefined) {
    throw new Error('Cannot find entry in manifest');
  }

  const deps = traceEntryPointJsDependencies(manifest, entry);

  const urlSafeKey = key.replaceAll('/', '');

  return {
    [urlSafeKey]: targetPath,
    ...Object.fromEntries(
      deps.map((filePath) => [
        removeExtension(path.basename(filePath)),
        path.join(directoryPath, filePath),
      ])
    ),
  };
}

async function resolveScopePaths(scope: Record<string, PackageWithBundle>) {
  const result = await Promise.all(
    Object.entries(scope).map(([key, info]) =>
      resolvePackageWithBundle(key, info)
    )
  );

  return mergeObjects(result);
}

async function resolvePaths() {
  const result = await Promise.all(
    Object.entries(redirects).map(
      async ([key, scope]) => [key, await resolveScopePaths(scope)] as const
    )
  );

  return Object.fromEntries(result);
}

export async function getSharedAssetsConfig(): Promise<SharedAssetsConfig> {
  const paths = await resolvePaths();

  return { paths };
}
