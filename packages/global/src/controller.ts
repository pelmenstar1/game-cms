import type { GameCmsController } from '@game-cms/core';

const store = globalThis as unknown as Record<string, unknown>;
const KEY = '__game_cms_controller__';

const _default: GameCmsController = {
  service: () => {
    throw new Error('CMS Controller is not initialized');
  },
};

export function cms(): GameCmsController {
  return (store[KEY] as GameCmsController | undefined) ?? _default;
}

export function setCmsController(value: GameCmsController) {
  store[KEY] = value;
}
