import 'game-cms';

import type { ResolveEntityRegistryData } from 'game-cms';

type Registry = typeof import('./registry.js');

declare module 'game-cms' {
  interface EntityTypeRegistry {
    ids: keyof Registry;
  }

  interface EntityTypeDataRegistry extends ResolveEntityRegistryData<Registry> {}
}
