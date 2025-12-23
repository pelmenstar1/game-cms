import type { ComponentClientManifestMap } from '@game-cms/types';

import { request } from '../internal/utils.js';
import { json } from '../responseParser.js';
import type { RequestContext } from '../types.js';

export const getComponentManifest = (context: RequestContext) =>
  request(context, {
    url: `/components/manifest`,
    response: json<ComponentClientManifestMap>(),
  });
