import type {
  ComponentControllerConfig,
  ComponentDataById,
  ComponentId,
  ComponentOptionsById,
  ComponentRenderer,
  ForeignComponentContext,
} from '@game-cms/types';
import React, { type Key } from 'react';

import type { IdSource } from '../../shared/src/idSource.js';

export type ComponentApi = {
  idSource: IdSource<Key>;

  getDefaultData: <Id extends ComponentId, Args = unknown>(
    id: Id,
    options: ComponentOptionsById<Id, Args>
  ) => ComponentDataById<Id, Args>;

  getComponent: <Id extends ComponentId, Args = unknown>(
    id: Id
  ) => ComponentRenderer<Id, Args>;

  getConfig: (id: ComponentId) => ComponentControllerConfig | undefined;

  clientResolverContext: ForeignComponentContext['clientResolver'];
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
