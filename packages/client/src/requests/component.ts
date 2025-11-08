import type { ComponentId, ComponentRenderManifest } from '@game-cms/types';

import { request } from '../internal/utils.js';
import { json } from '../responseParser.js';

export const getComponentManifest = request((key: ComponentId) => ({
  url: `/_components/${key}/manifest.json`,
  response: json<ComponentRenderManifest>(),
}));
