import type { GameCmsServiceMap } from './service.js';

export interface GameCmsController {
  service<K extends keyof GameCmsServiceMap>(name: K): GameCmsServiceMap[K];
}

declare global {
  const cms: GameCmsController;
}
