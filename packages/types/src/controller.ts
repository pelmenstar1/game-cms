import type { ServiceMap } from './service.js';

export interface GameCmsController {
  service<K extends keyof ServiceMap>(name: K): ServiceMap[K];
}
