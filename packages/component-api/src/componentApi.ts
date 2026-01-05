import type {
  ComponentControllerConfig,
  ComponentId,
  ComponentRenderer,
  ForeignComponentClientDataResolverContext,
} from '@game-cms/core';
import React, { type Key } from 'react';

import type { IdSource } from '../../shared/src/idSource.js';

export type ComponentApi = {
  generateId: IdSource<Key>;

  getDefaultData: ForeignComponentClientDataResolverContext['getDefaultData'];

  getComponent: <Id extends ComponentId>(id: Id) => ComponentRenderer<Id>;

  getConfig: (id: ComponentId) => ComponentControllerConfig | undefined;

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
