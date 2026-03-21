import { EntityId } from '@game-cms/base-core';
import { ForeignComponentClientDataTransformerContext } from '@game-cms/core';
import { createContext } from 'react';

export interface EntityHub {
  getClientDataResolverContext: (
    id: EntityId
  ) => Promise<ForeignComponentClientDataTransformerContext>;
}

export const EntityHubContext = createContext<EntityHub | null>(null);
