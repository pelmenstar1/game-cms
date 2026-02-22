import 'game-cms';

import type { ResolveEntityRegistryData } from 'game-cms';

type Registry = typeof import('./registry.js');

declare module 'game-cms' {
  interface EntityTypeRegistry {
    ids: keyof Registry;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface EntityTypeDataRegistry extends ResolveEntityRegistryData<Registry> {}
}
