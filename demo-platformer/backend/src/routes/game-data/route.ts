import { GameData } from '@demo-platformer/shared';
import { gameData } from '@demo-platformer/shared/schema';
import { createStandardClientWithApiToken } from '@game-cms/base-api/client';
import { json, request } from '@game-cms/core/api/client';
import { zodJsonValidator } from '@game-cms/core/node';
import { RouteOptions } from 'fastify';

import { cmsApiToken, cmsUrl } from '../../env.js';

type FileItem = GameData['hero']['animations'][number]['sprite'][number];

function resolveFileUrl(file: FileItem, baseUrl: string) {
  if (file.url.startsWith('/')) {
    file.url = new URL(file.url, baseUrl).toString();
  }
}

function resolveFileUrls(data: GameData, baseUrl: string) {
  resolveFileUrl(data.config.titleScene.background, baseUrl);
  resolveFileUrl(data.config.scoreScene.background, baseUrl);

  for (const animation of data.hero.animations) {
    for (const file of animation.sprite) {
      resolveFileUrl(file, baseUrl);
    }
  }

  for (const room of data.level.rooms) {
    resolveFileUrl(room.background, baseUrl);
    resolveFileUrl(room.terrain, baseUrl);

    for (const checkpointImage of Object.values(room.checkpointImages)) {
      resolveFileUrl(checkpointImage.idle.file, baseUrl);
      resolveFileUrl(checkpointImage.moving.file, baseUrl);
    }

    for (const { trap } of room.traps) {
      if (trap) {
        for (const animation of trap.animations) {
          for (const file of animation.sprite.image) {
            resolveFileUrl(file, baseUrl);
          }
        }
      }
    }

    for (const { item } of room.items) {
      if (item) {
        resolveFileUrl(item.collected, baseUrl);

        for (const file of item.sprite.image) {
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

    const data = await request(
      { client },
      {
        url: '/game-data' as never,
        method: 'GET',
        response: json({ validator: zodJsonValidator(gameData) }),
      }
    );

    resolveFileUrls(data, baseUrl);

    return data;
  },
} satisfies RouteOptions;
