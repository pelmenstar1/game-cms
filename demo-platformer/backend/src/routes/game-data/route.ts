import { GameData } from '@demo-platformer/shared';
import { gameData } from '@demo-platformer/shared/schema';
import { createStandardClientWithApiToken } from '@game-cms/base-api/client';
import { request } from '@game-cms/core/api/client';
import { RouteOptions } from 'fastify';

import { cmsApiToken, cmsUrl } from '../../env.js';

type FileItem = GameData['hero']['animations'][number]['sprite'][number];

function resolveFileUrl(file: FileItem, baseUrl: string) {
  if (file.url.startsWith('/')) {
    file.url = new URL(file.url, baseUrl).toString();
  }
}

function resolveFileUrls(data: GameData, baseUrl: string) {
  for (const animation of data.hero.animations) {
    for (const file of animation.sprite) {
      resolveFileUrl(file, baseUrl);
    }
  }

  for (const room of data.level.rooms) {
    for (const trapEntry of room.traps) {
      if (trapEntry.trap) {
        for (const animation of trapEntry.trap.animations) {
          for (const file of animation.sprite.image) {
            resolveFileUrl(file, baseUrl);
          }
        }
      }
    }

    for (const itemEntry of room.items) {
      if (itemEntry.item) {
        for (const file of itemEntry.item.sprite.image) {
          resolveFileUrl(file, baseUrl);
        }
      }
    }
  }
}

export default {
  url: '/api/game-data',
  method: 'GET',
  handler: async (): Promise<GameData> => {
    const baseUrl = cmsUrl();
    const client = await createStandardClientWithApiToken({
      baseUrl,
      apiToken: cmsApiToken(),
    });

    const response = await request(
      { client },
      { url: '/game-data' as never, method: 'GET' }
    );

    const data: unknown = await response.json();
    const parsed = gameData.parse(data);

    resolveFileUrls(parsed, baseUrl);

    return parsed;
  },
} satisfies RouteOptions;
