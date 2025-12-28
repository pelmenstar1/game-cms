import {
  type ComponentApi,
  ComponentApiContext,
} from '@game-cms/component-api';
import { createInMemoryCache } from '@game-cms/shared';
import type { ComponentId, ForeignComponentContext } from '@game-cms/types';
import { type PropsWithChildren, useMemo } from 'react';
import React from 'react';
import {
  getComponentClientResolver,
  getComponentConfig,
  getComponentDefaultData,
  getComponentValidator,
  importComponent,
} from 'virtual:dashboard/componentConnector';

import { type ComponentHub, ComponentHubContext } from './context';

const componentCache = createInMemoryCache((id: ComponentId) => {
  return React.lazy(async () => {
    const module = await importComponent(id);

    return { default: module.renderer };
  });
});

export function ComponentHubProvider({ children }: PropsWithChildren) {
  const validationContext = useMemo(
    (): ForeignComponentContext['validation'] => ({
      data: (id, data, options) => {
        const validator = getComponentValidator(id);

        return validator(data, options, validationContext);
      },
    }),
    []
  );

  const defaultDataContext = useMemo(
    (): ForeignComponentContext['default'] => ({
      data: (id, options) =>
        getComponentDefaultData(id, options, defaultDataContext),
    }),
    []
  );

  const clientResolverContext = useMemo(
    (): ForeignComponentContext['clientResolver'] => ({
      fromClient: (id, clientData, options) => {
        const resolver = getComponentClientResolver(id);

        return resolver
          ? resolver.fromClient(clientData, options, clientResolverContext)
          : { result: clientData };
      },
      toClient: (id, data, options) => {
        const resolver = getComponentClientResolver(id);

        return resolver
          ? resolver.toClient(data, options, clientResolverContext)
          : data;
      },
    }),
    []
  );

  const api = useMemo(
    (): ComponentApi => ({
      getDefaultData: defaultDataContext.data,
      getComponent: (id) => componentCache.get(id, api),
      getConfig: getComponentConfig,
      clientResolverContext,
    }),
    [clientResolverContext, defaultDataContext]
  );

  const hub = useMemo(
    (): ComponentHub => ({
      validationContext,
    }),
    [validationContext]
  );

  return (
    <ComponentApiContext.Provider value={api}>
      <ComponentHubContext.Provider value={hub}>
        {children}
      </ComponentHubContext.Provider>
    </ComponentApiContext.Provider>
  );
}
