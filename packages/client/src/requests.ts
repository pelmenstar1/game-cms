import type { ComponentId, ComponentRenderManifest } from '@game-cms/types';

import { json } from './responseParser.js';
import type { RequestContext, RequestOptionsWithResult } from './types.js';

function get<Args extends unknown[], R>(
  factory: (...args: Args) => RequestOptionsWithResult<R>
) {
  return (context: RequestContext, ...args: Args) => {
    const signal = context.abortController?.signal;
    const init = factory(...args);
    if (signal) {
      init.signal = signal;
    }

    return context.client.makeRequest<R>(init);
  };
}

export const getComponentManifest = get((key: ComponentId) => ({
  path: `/_components/${key}/manifest.json`,
  response: json<ComponentRenderManifest>(),
}));
