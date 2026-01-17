import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

declare global {
  interface ImportMeta {
    vitest?: boolean;
  }
}

export function resolveImport(meta: ImportMeta, id: string) {
  try {
    return meta.resolve(id);
  } catch (error) {
    // To handle the case when we're are resolving an import inside the Vitest env
    if (error instanceof Error && error.message.includes('[module runner]')) {
      const result = createRequire(meta.url).resolve(id);

      return pathToFileURL(result);
    }

    throw error;
  }
}

export function resolveImportDirectory(meta: ImportMeta, id: string) {
  return path.dirname(fileURLToPath(resolveImport(meta, id)));
}
