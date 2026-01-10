import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

import type { ComponentId } from '@game-cms/core';
import { env } from '@game-cms/global';
import { filterOutNullable } from '@game-cms/shared/collections';

import { getComponentIdFromCoreFile } from './analysis.js';

export type ComponentClientChunkEntry = {
  paths: {
    renderer: string;
    core: string;
    client?: string;
  };
};

export type ComponentClientChunkMap = Record<
  ComponentId,
  ComponentClientChunkEntry
>;

async function gatherComponentClientChunk(dirPath: string) {
  const renderer = path.join(dirPath, 'renderer.js');
  const core = path.join(dirPath, 'core.js');
  const client = path.join(dirPath, 'client.js');

  if (fs.existsSync(renderer) && fs.existsSync(core)) {
    const componentId = await getComponentIdFromCoreFile(core);

    const entry: ComponentClientChunkEntry = {
      paths: {
        renderer,
        core,
        client: fs.existsSync(client) ? client : undefined,
      },
    };

    return [componentId, entry] as const;
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

export async function gatherComponents(): Promise<ComponentClientChunkMap> {
  const { components } = env();

  const result = await Promise.all(
    components.distributions.map(({ directoryPath }) =>
      gatherComponentsForDistribution(directoryPath)
    )
  );

  return Object.fromEntries(result.flat());
}
