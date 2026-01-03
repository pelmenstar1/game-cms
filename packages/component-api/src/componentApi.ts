import type {
  ComponentClientDataById,
  ComponentControllerConfig,
  ComponentId,
  ComponentOptionsById,
  ComponentRenderer,
  ForeignComponentClientDataResolverContext,
} from '@game-cms/core';
import React, { type Key } from 'react';

import type { IdSource } from '../../shared/src/idSource.js';

export type ComponentApi = {
  generateId: IdSource<Key>;

  getDefaultData: <Id extends ComponentId, Args = unknown>(
    id: Id,
    options: ComponentOptionsById<Id, Args>
  ) => ComponentClientDataById<Id, Args>;

  getComponent: <Id extends ComponentId>(id: Id) => ComponentRenderer<Id>;

  getConfig: (id: ComponentId) => ComponentControllerConfig | undefined;

  clientResolverContext: ForeignComponentClientDataResolverContext;
};

export const ComponentApiContext =
  /*@__PURE__*/ React.createContext<ComponentApi | null>(null);

export function useComponentApi() {
  const result = React.useContext(ComponentApiContext);
  if (result === null) {
    throw new Error('ComponentApiContext is not in the tree');
  }

  return result;
}
