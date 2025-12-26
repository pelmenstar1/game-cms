import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

import { filterOutNullable } from '@game-cms/shared/collections';
import { isFileNotFoundError } from '@game-cms/shared/errors';
import type { ComponentId, ComponentsFsInfo } from '@game-cms/types';

import { getComponentIdFromMetaFile } from './analysis.js';

export type ComponentClientChunkEntry = {
  client: string;
  metaFilePath: string;
};

export type ComponentClientChunkMap = Record<
  ComponentId,
  ComponentClientChunkEntry
>;

async function gatherComponentClientChunk(dirPath: string) {
  const clientPath = path.join(dirPath, 'client.js');
  const metaPath = path.join(dirPath, 'meta.js');

  try {
    if (fs.existsSync(clientPath) && fs.existsSync(metaPath)) {
      const componentId = await getComponentIdFromMetaFile(metaPath);

      return [
        componentId,
        { client: clientPath, metaFilePath: metaPath },
      ] as const;
    }
  } catch (error: unknown) {
    if (!isFileNotFoundError(error)) {
      throw error;
    }
  }
}

async function gatherComponentsForDistribution(distPath: string) {
  const entries = await fsp.readdir(distPath, { withFileTypes: true });

  const result = await Promise.all(
    entries.map(async (entry) => {
      if (entry.isDirectory()) {
        return gatherComponentClientChunk(path.join(distPath, entry.name));
      }
    })
  );

  return filterOutNullable(result);
}

export async function gatherComponents(
  fsInfo: ComponentsFsInfo
): Promise<ComponentClientChunkMap> {
  const result = await Promise.all(
    fsInfo.distributions.map((distPath) =>
      gatherComponentsForDistribution(distPath)
    )
  );

  return Object.fromEntries(result.flat());
}
