import type {
  ComponentId,
  ComponentMeta,
  ComponentRenderer,
  ForeignComponentClientDataResolverContext,
  ForeignComponentPathWalkerContext,
} from '@game-cms/core';
import React, { type Key } from 'react';

import type { IdSource } from '../../shared/src/idSource.js';

export type ComponentApi = {
  generateId: IdSource<Key>;

  getComponent: <Id extends ComponentId>(id: Id) => ComponentRenderer<Id>;

  getDefaultData: ForeignComponentClientDataResolverContext['getDefaultData'];
  getMeta: (id: ComponentId) => ComponentMeta | undefined;
  applyAtPath: ForeignComponentPathWalkerContext['applyAtPath'];

  clientTransformerContext: ForeignComponentClientDataResolverContext;
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
