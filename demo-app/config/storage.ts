import { localStorageProvider } from '@game-cms/storage-provider-local';
import type { StorageInit } from 'game-cms';

export const config: StorageInit = () => ({
  provider: localStorageProvider(),
});
