import type { ComponentId, ComponentRenderManifest } from '@game-cms/types';

import { json } from '../responseParser.js';
import { request } from '../utils.js';

export const getComponentManifest = request((key: ComponentId) => ({
  url: `/_components/${key}/manifest.json`,
  response: json<ComponentRenderManifest>(),
}));
