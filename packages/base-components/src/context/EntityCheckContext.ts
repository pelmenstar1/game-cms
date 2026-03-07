import { EntityCheckId, EntityCheckRenderer } from '@game-cms/base-core';
import { MaybePromise, unimplemented } from '@game-cms/shared';
import React from 'react';

export type EntityCheckContextType = {
  getRenderer: <Id extends EntityCheckId>(
    id: Id
  ) => MaybePromise<EntityCheckRenderer<Id> | undefined>;
};

export const EntityCheckContext = React.createContext<EntityCheckContextType>({
  getRenderer: unimplemented('getRenderer'),
});
