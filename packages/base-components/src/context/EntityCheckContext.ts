import {
  EntityCheckClientController,
  EntityCheckClientOptions,
  EntityCheckId,
} from '@game-cms/base-core';
import { MaybePromise, unimplemented } from '@game-cms/shared';
import React from 'react';

export type EntityCheckContextType = {
  getOptions: <Id extends EntityCheckId>(
    id: Id
  ) => EntityCheckClientOptions<Id> | undefined;

  getClientController: <Id extends EntityCheckId>(
    id: Id
  ) => MaybePromise<EntityCheckClientController<Id> | undefined>;
};

export const EntityCheckContext = React.createContext<EntityCheckContextType>({
  getOptions: unimplemented('getOptions'),
  getClientController: unimplemented('getClientController'),
});
