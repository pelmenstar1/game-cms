import type { ServiceById, ServiceId } from './service.js';

export interface GameCmsController {
  service<K extends ServiceId>(name: K): ServiceById<K>;
}
