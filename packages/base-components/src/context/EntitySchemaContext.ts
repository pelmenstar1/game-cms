import { EntityId, EntitySchemaById } from '@game-cms/base-core';
import React from 'react';

export type EntitySchemaContextType = {
  getEntitySchemaById: <Id extends EntityId>(
    id: Id
  ) => Promise<EntitySchemaById<Id>>;
};

export const EntitySchemaContext = React.createContext<EntitySchemaContextType>(
  {
    getEntitySchemaById: () => {
      return Promise.reject(
        new Error('getEntitySchemaById is not implemented')
      );
    },
  }
);
