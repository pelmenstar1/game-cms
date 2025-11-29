import { importFile, isNonNullObject } from '@game-cms/shared';
import { scanDirectory } from '@game-cms/shared/io';
import type { ApiRoute, ComponentController, Service } from '@game-cms/types';
import type { ZodType } from 'zod';

import {
  componentSchema,
  routeSchema,
  serviceSchema,
} from '../../utils/schema.js';

async function maybeImportWithSchema<T>(
  schema: ZodType<T>,
  filePath: string
): Promise<T | undefined> {
  try {
    const module = await importFile(filePath);

    if (isNonNullObject(module) && 'default' in module) {
      const result = schema.safeParse(module.default);
      if (result.success) {
        return module.default as T;
      }

      console.error(
        `Failed to import ${filePath} because of the invalid default import: ${result.error.message}`
      );
    }
  } catch (error: unknown) {
    console.error(`Failed to import ${filePath} because of ${error}`);
  }
}

async function scanDirectoryWithSchema<T>(
  schema: ZodType<T>,
  directoryPath: string
): Promise<T[]> {
  return scanDirectory(directoryPath, async (filePath) => {
    if (filePath.endsWith('.js')) {
      return maybeImportWithSchema(schema, filePath);
    }
  });
}

async function scanDirectoriesWithSchema<T>(
  schema: ZodType<T>,
  directoryPaths: string[]
): Promise<T[]> {
  const result = await Promise.all(
    directoryPaths.map((dirPath) => scanDirectoryWithSchema(schema, dirPath))
  );

  return result.flat();
}

const scanDirectoriesFactory =
  <T>(schema: ZodType) =>
  (directoryPaths: string[]) =>
    scanDirectoriesWithSchema(schema, directoryPaths) as Promise<T[]>;

export const scanServices = scanDirectoriesFactory<Service>(serviceSchema);
export const scanApiRoutes = scanDirectoriesFactory<ApiRoute>(routeSchema);
export const scanComponents =
  scanDirectoriesFactory<ComponentController>(componentSchema);
