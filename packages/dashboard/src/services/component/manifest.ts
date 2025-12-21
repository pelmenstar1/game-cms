import { getComponentManifest, type RequestContext } from '@game-cms/client';
import { createInMemoryCache } from '@game-cms/shared';
import type { ComponentId } from '@game-cms/types';

const cache = createInMemoryCache(
  (componentId: ComponentId, context: RequestContext) =>
    getComponentManifest(context, componentId)
);

export const getCachedComponentManifest = cache.get;
