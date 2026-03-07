import { EntityId, EntitySchemaById } from '@game-cms/base-core';
import { unimplemented } from '@game-cms/shared';
import React from 'react';

export type EntitySchemaContextType = {
  entityIds: EntityId[];

  getEntityTitle: (id: EntityId) => string;

  getEntitySchemaById: <Id extends EntityId>(
    id: Id
  ) => Promise<EntitySchemaById<Id>>;
};

export const EntitySchemaContext = React.createContext<EntitySchemaContextType>(
  {
    entityIds: [],
    getEntityTitle: unimplemented('getEntityTitle'),
    getEntitySchemaById: unimplemented.async('getEntitySchemaById'),
  }
);
