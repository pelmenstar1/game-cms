import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

import { filterOutNullable } from '@game-cms/shared/collections';
import type { ComponentId, ComponentsFsInfo } from '@game-cms/types';

import { getComponentIdFromMetaFile } from './analysis.js';

export type ComponentClientChunkEntry = {
  mainFilePath: string;
  metaFilePath: string;
  validatorFilePath: string;
};

export type ComponentClientChunkMap = Record<
  ComponentId,
  ComponentClientChunkEntry
>;

async function gatherComponentClientChunk(dirPath: string) {
  const mainFilePath = path.join(dirPath, 'client.js');
  const metaFilePath = path.join(dirPath, 'meta.js');
  const validatorFilePath = path.join(dirPath, 'validator.js');

  if (
    fs.existsSync(mainFilePath) &&
    fs.existsSync(metaFilePath) &&
    fs.existsSync(validatorFilePath)
  ) {
    const componentId = await getComponentIdFromMetaFile(metaFilePath);

    return [
      componentId,
      { mainFilePath, metaFilePath, validatorFilePath },
    ] as const;
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
