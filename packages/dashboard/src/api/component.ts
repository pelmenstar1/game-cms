import { fetchObject } from '@game-cms/shared/fetch';
import type { ComponentId, ComponentRenderManifest } from '@game-cms/types';

export function getComponentManifest(key: ComponentId) {
  return fetchObject<ComponentRenderManifest>(
    `/api/_components/${key}/manifest.json`
  );
}
