import type {
  ComponentClientRenderManifest,
  ComponentId,
} from '@game-cms/types';

import { request } from '../internal/utils.js';
import { json } from '../responseParser.js';
import type { RequestContext } from '../types.js';

export const getComponentManifest = (
  context: RequestContext,
  key: ComponentId
) =>
  request(context, {
    url: `/_components/${key}/manifest.json`,
    response: json<ComponentClientRenderManifest>(),
  });
