import type { ResolveServices, ServerUser } from '@game-cms/types';

type Services = [
  typeof import('./entity.js'),
  typeof import('./component.js'),
  typeof import('./database.js'),
  typeof import('./entitySchema.js'),
  typeof import('./user.js'),
];

declare module '@game-cms/types' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface GameCmsServiceMap extends ResolveServices<Services> {}

  interface DatabaseEntityMap {
    'base::users': ServerUser;
  }
}
