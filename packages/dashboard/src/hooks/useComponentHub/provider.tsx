import {
  type ComponentApi,
  ComponentApiContext,
} from '@game-cms/component-api';
import type {
  ComponentClientDataById,
  ComponentId,
  ComponentOptionsById,
  ComponentRawDataById,
  ComponentRawInDataById,
  ComponentRenderer,
  ForeignComponentClientDataResolverContext,
  ForeignComponentDefaultRawDataContext,
  ForeignComponentValidationContext,
} from '@game-cms/core';
import { createInMemoryCache, incrementingIdSource } from '@game-cms/shared';
import { type PropsWithChildren, useMemo } from 'react';
import React from 'react';

import {
  getComponentClientTransformer,
  getComponentDefaultData,
  getComponentMeta,
  getComponentValidator,
  importComponent,
} from '@/connector/component';

import { type ComponentHub, ComponentHubContext } from './context';

const componentCache = createInMemoryCache((id: ComponentId) => {
  return React.lazy(async () => {
    const module = await importComponent(id);

    return { default: module.renderer };
  });
});

export function ComponentHubProvider({ children }: PropsWithChildren) {
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
    (): ForeignComponentDefaultRawDataContext => ({
      getDefaultData: (id, options) => {
        return getComponentDefaultData(id, options, defaultDataContext);
      },
    }),
    []
  );

  const clientTransformerContext = useMemo(
    (): ForeignComponentClientDataResolverContext => ({
      idSource: incrementingIdSource,
      validation: validationContext,
      getDefaultData: <Id extends ComponentId, Args>(
        id: Id,
        options: ComponentOptionsById<Id, Args>
      ) => {
        const resolver = getComponentClientTransformer(id);

        return resolver
          ? resolver.getDefaultData(options, clientTransformerContext)
          : (defaultDataContext.getDefaultData(
              id,
              options
            ) as ComponentClientDataById<Id, Args>);
      },
      fromClient: <Id extends ComponentId, Args>(
        id: Id,
        clientData: ComponentClientDataById<Id, Args>,
        options: ComponentOptionsById<Id, Args>
      ) => {
        const resolver = getComponentClientTransformer(id);

        const response = resolver
          ? resolver.fromClient(clientData, options, clientTransformerContext)
          : { result: clientData as ComponentRawInDataById<Id, Args> };

        if (!resolver?.ownValidation && response.result !== undefined) {
          const coreError = validationContext.validate(
            id,
            response.result,
            options
          );

          if (coreError !== undefined) {
            return { error: coreError };
          }
        }

        return response;
      },
      toClient: <Id extends ComponentId, Args>(
        id: Id,
        data: ComponentRawDataById<Id, Args>,
        options: ComponentOptionsById<Id>
      ) => {
        const resolver = getComponentClientTransformer(id);

        return resolver
          ? resolver.toClient(data, options, clientTransformerContext)
          : (data as ComponentClientDataById<Id, Args>);
      },
    }),
    [defaultDataContext, validationContext]
  );

  const api = useMemo(
    (): ComponentApi => ({
      generateId: incrementingIdSource,
      getDefaultData: clientTransformerContext.getDefaultData,
      getComponent: <Id extends ComponentId>(id: Id) =>
        componentCache.get(id, null) as unknown as ComponentRenderer<Id>,
      getMeta: getComponentMeta,
      clientTransformerContext,
    }),
    [clientTransformerContext]
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
