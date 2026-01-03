import {
  type ComponentApi,
  ComponentApiContext,
  useApiClient,
} from '@game-cms/component-api';
import type {
  ComponentClientDataById,
  ComponentId,
  ComponentOptionsById,
  ComponentRawDataById,
  ComponentRenderer,
  ForeignComponentClientDataResolverContext,
  ForeignComponentDefaultDataContext,
  ForeignComponentValidationContext,
} from '@game-cms/core';
import { createInMemoryCache, incrementingIdSource } from '@game-cms/shared';
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
  const client = useApiClient();

  const validationContext = useMemo(
    (): ForeignComponentValidationContext => ({
      validate: (id, data, options) => {
        const validator = getComponentValidator(id);

        return validator(data, options, validationContext);
      },
    }),
    []
  );

  const defaultDataContext = useMemo(
    (): ForeignComponentDefaultDataContext => ({
      getDefault: (id, options) => {
        return getComponentDefaultData(id, options, defaultDataContext);
      },
    }),
    []
  );

  const clientResolverContext = useMemo(
    (): ForeignComponentClientDataResolverContext => ({
      idSource: incrementingIdSource,
      makeRequest: (fn, args) => {
        return client.makeApiRequest(fn, args).promise;
      },
      getDefaultData: <Id extends ComponentId, Args>(
        id: Id,
        options: ComponentOptionsById<Id, Args>
      ) => {
        const resolver = getComponentClientResolver(id);

        return resolver
          ? resolver.getDefaultData(options, clientResolverContext)
          : (defaultDataContext.getDefault(
              id,
              options
            ) as ComponentClientDataById<Id, Args>);
      },
      fromClient: (id, clientData, options) => {
        const resolver = getComponentClientResolver(id);

        return resolver
          ? resolver.fromClient(clientData, options, clientResolverContext)
          : { result: clientData };
      },
      toClient: <Id extends ComponentId, Args>(
        id: Id,
        data: ComponentRawDataById<Id, Args>,
        options: ComponentOptionsById<Id>
      ) => {
        const resolver = getComponentClientResolver(id);

        return resolver
          ? resolver.toClient(data, options, clientResolverContext)
          : (data as ComponentClientDataById<Id, Args>);
      },
    }),
    [client, defaultDataContext]
  );

  const api = useMemo(
    (): ComponentApi => ({
      generateId: incrementingIdSource,
      getDefaultData: clientResolverContext.getDefaultData,
      getComponent: <Id extends ComponentId>(id: Id) =>
        componentCache.get(id, null) as unknown as ComponentRenderer<Id>,
      getConfig: getComponentConfig,
      clientResolverContext,
    }),
    [clientResolverContext]
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
