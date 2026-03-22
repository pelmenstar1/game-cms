import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

import type { ComponentId } from '@game-cms/core';
import { getComponentIdFromClientFile } from '@game-cms/core/node';
import { filterOutNullable } from '@game-cms/shared/collections';

export type ComponentClientChunkEntry = {
  paths: {
    renderer: string;
    client: string;
  };
};

export type ComponentClientChunkMap = Record<
  ComponentId,
  ComponentClientChunkEntry
>;

async function gatherComponentClientChunk(dirPath: string) {
  const renderer = path.join(dirPath, 'renderer.js');
  const client = path.join(dirPath, 'client.js');

  const componentId = await getComponentIdFromClientFile(client);

  if (componentId !== null && fs.existsSync(renderer)) {
    const entry: ComponentClientChunkEntry = {
      paths: { renderer, client },
    };

    return [componentId, entry] as const;
  }
}

async function gatherComponentsForDistribution(distPath: string) {
  const entries = await fsp.readdir(distPath, { withFileTypes: true });

  const result = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map((entry) =>
        gatherComponentClientChunk(path.join(distPath, entry.name))
      )
  );

  return filterOutNullable(result);
}

export async function gatherComponents(env: {
  components: {
    distributions: {
      directoryPath: string;
    }[];
  };
}): Promise<ComponentClientChunkMap> {
  const result = await Promise.all(
    env.components.distributions.map(({ directoryPath }) =>
      gatherComponentsForDistribution(directoryPath)
    )
  );

  return Object.fromEntries(result.flat());
}
