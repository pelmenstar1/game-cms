import { EntityClientContext, EntityId } from '@game-cms/base-core';
import { unimplemented } from '@game-cms/shared';
import React from 'react';

export type EntitySchemaContextType = {
  entityIds: EntityId[];

  getEntityTitle: (id: EntityId) => string;

  getEntitySharedContext: (
    id: EntityId
  ) => Promise<EntityClientContext | undefined>;
};

export const EntitySchemaContext = React.createContext<EntitySchemaContextType>(
  {
    entityIds: [],
    getEntityTitle: unimplemented('getEntityTitle'),
    getEntitySharedContext: unimplemented.async('getEntitySharedContext'),
  }
);
