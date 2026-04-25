import type { GameCmsController } from '@game-cms/core';

declare global {
  var __game_cms_controller__: GameCmsController | undefined;
}

const KEY = '__game_cms_controller__';

const _default: GameCmsController = {
  service: () => {
    throw new Error('CMS Controller is not initialized');
  },
};

export function cms(): GameCmsController {
  return globalThis[KEY] ?? _default;
}

export function setCmsController(value: GameCmsController) {
  globalThis[KEY] = value;
}
