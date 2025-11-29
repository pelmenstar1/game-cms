import type { GameCmsController } from '@game-cms/types';

export function setCmsController(value: GameCmsController) {
  (globalThis as unknown as { cms: GameCmsController }).cms = value;
}
