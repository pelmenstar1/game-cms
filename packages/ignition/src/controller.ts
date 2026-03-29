import type { GameCmsController } from '@game-cms/core';
import { env, setCmsController } from '@game-cms/global';

export function createController(): GameCmsController {
  const { services } = env();

  return {
    service(name) {
      const result = services[name];

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (result === undefined) {
        throw new Error(`Unknown service: ${name}`);
      }

      return result;
    },
  };
}

export function initCmsController() {
  setCmsController(createController());
}
