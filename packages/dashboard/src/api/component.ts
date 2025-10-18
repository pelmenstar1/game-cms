import { fetchObject } from '@game-cms/shared/fetch';
import type { ComponentKey, ComponentRenderManifest } from '@game-cms/types';

export function getComponentManifest(key: ComponentKey) {
  return fetchObject<ComponentRenderManifest>(
    `/api/_components/${key}/manifest.json`
  );
}
