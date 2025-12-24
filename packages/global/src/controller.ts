import type { GameCmsController } from '@game-cms/types';

let _cms: GameCmsController = {
  service: () => {
    throw new Error('CMS Controller is not initialized');
  },
};

export function cms() {
  return _cms;
}

export function setCmsController(value: GameCmsController) {
  _cms = value;
}
