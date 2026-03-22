import { AnyStorageAddon } from './addon.js';
import { AnyStorageProvider } from './provider.js';

export type StorageConfig = {
  provider: AnyStorageProvider;
  addons?: AnyStorageAddon[];
};

declare module '@game-cms/core' {
  interface UnresolvedCmsConfig {
    storage: StorageConfig;
  }
}
