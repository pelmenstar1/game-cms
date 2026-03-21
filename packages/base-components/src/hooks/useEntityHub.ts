import { contextUseFactory } from '@game-cms/ui';

import { EntityHubContext } from '../context/EntityHubContext.js';

export const useEntityHub = contextUseFactory(
  EntityHubContext,
  'EntityHubContext'
);
