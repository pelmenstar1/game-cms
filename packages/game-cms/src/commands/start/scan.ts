import fsp from 'node:fs/promises';
import path from 'node:path';

import { importFile, type MaybePromise } from '@game-cms/shared';
import { isFileNotFoundError } from '@game-cms/shared/errors';
import {
  type ApiRoute,
  type ComponentController,
  type Service,
} from '@game-cms/types';
import { ZodType } from 'zod';

import { statusError } from '../../utils/log.js';
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

    if (typeof module === 'object' && module !== null && 'default' in module) {
      const result = schema.safeParse(module.default);
      if (result.success) {
        return module.default as T;
      }

      statusError(
        `Failed to import ${filePath} because of the invalid default import: ${result.error.message}`
      );
    }
  } catch (error: unknown) {
    statusError(`Failed to import ${filePath} because of ${error}`);
  }
}

export async function scanDirectory<T>(
  directoryPath: string,
  handler: (filePath: string) => MaybePromise<T | undefined>
): Promise<T[]> {
  try {
    const entries = await fsp.readdir(directoryPath, { withFileTypes: true });

    const result = (await Promise.all(
      entries.map(async (entry) => {
        const entryPath = path.join(directoryPath, entry.name);

        if (entry.isDirectory()) {
          return scanDirectory(entryPath, handler);
        } else if (entry.isFile()) {
          return handler(entryPath);
        }
      })
    )) as (T | undefined)[][];

    return result.flat().filter((value) => value !== undefined);
  } catch (error: unknown) {
    if (isFileNotFoundError(error)) {
      return [];
    }

    throw error;
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
