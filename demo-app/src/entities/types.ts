import type { ResolveEntities } from 'game-cms';

declare module '@game-cms/types' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface EntityMap extends ResolveEntities<[typeof import('./test.js')]> {}
}
