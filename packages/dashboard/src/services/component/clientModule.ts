import type { RequestContext } from '@game-cms/client';
import { createInMemoryCache, isNonNullObject } from '@game-cms/shared';
import type { ComponentClientModule, ComponentId } from '@game-cms/types';

import { getCachedComponentManifest } from './manifest';

function validateFunctionAndParameters(
  value: unknown,
  maxLength: number,
  targetName: string
) {
  if (typeof value !== 'function') {
    throw new TypeError(`${targetName} is not a function`);
  }

  if (value.length > maxLength) {
    throw new TypeError(`${targetName} accepts too many parameters`);
  }
}

function validateClientModule(
  rawClientModule: unknown
): asserts rawClientModule is ComponentClientModule {
  if (!isNonNullObject(rawClientModule)) {
    throw new Error('Module is not an object');
  }

  const { renderer, validator } = rawClientModule as {
    renderer?: unknown;
    validator?: unknown;
  };

  validateFunctionAndParameters(renderer, 1, 'Renderer');
  validateFunctionAndParameters(validator, 2, 'Validator');
}

const cache = createInMemoryCache(
  async (key: ComponentId, context: RequestContext) => {
    const manifest = await getCachedComponentManifest(key, context);

    const clientModule: unknown = await import(
      /* @vite-ignore */
      manifest.main
    );

    validateClientModule(clientModule);

    return clientModule;
  }
);

export const getCachedClientModule = cache.get;
