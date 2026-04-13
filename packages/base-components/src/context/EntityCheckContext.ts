import {
  EntityCheckClientController,
  EntityCheckId,
} from '@game-cms/base-core';
import { MaybePromise, unimplemented } from '@game-cms/shared';
import React from 'react';

export type EntityCheckContextType = {
  checkIds: EntityCheckId[];
  getClientController: <Id extends EntityCheckId>(
    id: Id
  ) => MaybePromise<EntityCheckClientController<Id> | undefined>;
};

export const EntityCheckContext = React.createContext<EntityCheckContextType>({
  checkIds: [],
  getClientController: unimplemented('getClientController'),
});
