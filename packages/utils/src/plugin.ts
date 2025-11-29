import { importFile } from '@game-cms/shared';
import { scanDirectory } from '@game-cms/shared/io';
import type { PluginValueSource } from '@game-cms/types';

export function scanDirectorySource<T>(
  directoryPath: string
): PluginValueSource<T[]> {
  return () => {
    return scanDirectory(directoryPath, async (filePath) => {
      try {
        const { default: defaultExport } = await importFile<{ default?: T }>(
          filePath
        );

        return defaultExport;
      } catch (error: unknown) {
        console.error(error);
      }
    });
  };
}
