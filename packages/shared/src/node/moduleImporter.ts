import { createJiti, type JitiOptions } from 'jiti';

import type { MaybePromise } from '../maybePromise.js';
import { importFile } from './import.js';

export type ModuleImporter = {
  accept: (filePath: string) => boolean;
  import: <T = unknown>(filePath: string) => MaybePromise<T>;
};

export const jsDefaultModuleImporter: ModuleImporter = {
  accept: (filePath) => filePath.endsWith('.js'),
  import: async <T>(filePath: string) => {
    const { default: defaultExport } = await importFile<{ default: T }>(
      filePath
    );

    return defaultExport;
  },
};

export function tsDefaultModuleImporter(
  url: string,
  options?: JitiOptions
): ModuleImporter {
  const jiti = createJiti(url, options);

  return {
    accept: (filePath) => filePath.endsWith('.js') || filePath.endsWith('.ts'),
    import: async <T>(filePath: string) => {
      return jiti.import<T>(filePath, {
        default: true,
      });
    },
  };
}
