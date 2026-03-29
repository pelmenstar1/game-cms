import { gameData } from '@demo-platformer/shared/schema';
import { safeFetch } from '@game-cms/shared';
import { RouteOptions } from 'fastify';

import { cmsApiToken, cmsUrl } from '../../env.js';

export default {
  url: '/game-data',
  method: 'GET',
  handler: async () => {
    const response = await safeFetch(`${cmsUrl()}/game-data`, {
      headers: {
        Authorization: `Bearer ${cmsApiToken()}`,
      },
    });

    const data: unknown = await response.json();
    if (!gameData.safeParse(data).success) {
      throw new Error('Invalid game data');
    }

    return data;
  },
} satisfies RouteOptions;
