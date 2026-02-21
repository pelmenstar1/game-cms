import type { PluginValueSource } from '@game-cms/core';
import { importFile, scanDirectory } from '@game-cms/shared/node';

export function scanDirectorySource<T>(
  directoryPath: string
): PluginValueSource<T[]> {
  return () => {
    return scanDirectory(directoryPath, async (filePath) => {
      if (filePath.endsWith('.js')) {
        try {
          const { default: defaultExport } = await importFile<{ default?: T }>(
            filePath
          );

          return defaultExport;
        } catch (error: unknown) {
          console.error(error);
        }
      }
    });
  };
}
