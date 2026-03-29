import type { PluginValueSource } from '@game-cms/core';
import { ModuleImporter, scanDirectory } from '@game-cms/shared/node';

export function scanDirectorySource<T>(
  directoryPath: string,
  importer: ModuleImporter
): PluginValueSource<T[]> {
  return () => {
    return scanDirectory(directoryPath, async (filePath) => {
      if (importer.accept(filePath)) {
        try {
          return await importer.import<T>(filePath);
        } catch (error: unknown) {
          console.error(error);
        }
      }
    });
  };
}
