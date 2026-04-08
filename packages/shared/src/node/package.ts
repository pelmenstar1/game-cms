import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { readJson } from './index.js';

declare global {
  interface ImportMeta {
    vitest?: boolean;
  }
}

export type PackageInfo = {
  name: string;
  main?: string;
  types?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  bin?: string | Record<string, string>;
  exports?: Record<string, { import?: string; types?: string }>;
};

export function resolveImport(meta: ImportMeta, id: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (meta.resolve) {
      return meta.resolve(id);
    }
  } catch (error) {
    // To handle the case when we're are resolving an import inside the Vitest env
    if (
      !(error instanceof Error && error.message.includes('[module runner]'))
    ) {
      throw error;
    }
  }

  const result = createRequire(meta.url).resolve(id);

  return pathToFileURL(result).href;
}

export function resolveImportFile(meta: ImportMeta, id: string) {
  return fileURLToPath(resolveImport(meta, id));
}

export function resolveImportDirectory(meta: ImportMeta, id: string) {
  return path.dirname(resolveImportFile(meta, id));
}

export function findNearestPackageRoot(initialDir: string): string {
  let dir = initialDir;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    if (fs.existsSync(path.join(dir, 'package.json'))) {
      return dir;
    }

    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error(`No package.json found starting from: ${initialDir}`);
    }

    dir = parent;
  }
}

export async function readPackageInfo(dirPath: string) {
  return readJson<PackageInfo>(path.join(dirPath, 'package.json'));
}

export async function resolvePackageBin(packagePath: string, target: string) {
  const { bin } = await readJson<PackageInfo>(packagePath);

  if (typeof bin === 'string') {
    return bin;
  } else if (typeof bin === 'object') {
    return bin[target];
  }
}
