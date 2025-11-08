import { env } from '@game-cms/env';

export async function setupStorageProvider() {
  await env().config.storage.provider.init?.();
}
