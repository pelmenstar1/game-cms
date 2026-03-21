import type {
  ComponentId,
  ComponentMeta,
  ComponentRenderer,
  ForeignComponentClientDataTransformerContext,
  ForeignComponentPathWalkerContext,
} from '@game-cms/core';
import { IdSource } from '@game-cms/shared';
import React, { type Key } from 'react';

export type ComponentApi = {
  generateId: IdSource<Key>;

  getComponent: <Id extends ComponentId>(id: Id) => ComponentRenderer<Id>;

  getDefaultData: ForeignComponentClientDataTransformerContext['getDefaultData'];
  getMeta: (id: ComponentId) => ComponentMeta | undefined;
  applyAtPath: ForeignComponentPathWalkerContext['applyAtPath'];
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
