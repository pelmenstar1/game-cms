import type {
  ComponentControllerConfig,
  ComponentDataById,
  ComponentId,
  ComponentOptionsById,
  ComponentRenderer,
  ForeignComponentContext,
} from '@game-cms/types';
import React from 'react';

export type ComponentApi = {
  getDefaultData: <Id extends ComponentId>(
    id: Id,
    options: ComponentOptionsById<Id>
  ) => ComponentDataById<Id>;

  getComponent: <Id extends ComponentId>(id: Id) => ComponentRenderer<Id>;

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
