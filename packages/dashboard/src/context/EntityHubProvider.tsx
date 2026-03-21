import { EntityHub, EntityHubContext } from '@game-cms/base-components/shared';
import { EntityId } from '@game-cms/base-core';
import {
  type ComponentApi,
  ComponentApiContext,
} from '@game-cms/component-api';
import type {
  ComponentClientDataById,
  ComponentClientOptionsById,
  ComponentId,
  ComponentInDataById,
  ComponentOutDataById,
  ForeignComponentClientDataTransformerContext,
  ForeignComponentClientDefaultDataContext,
  ForeignComponentDefaultDataContext,
  ForeignComponentPathWalkerContext,
  ForeignComponentValidationContext,
} from '@game-cms/core';
import { createCachedFactory, incrementingIdSource } from '@game-cms/shared';
import { type PropsWithChildren, useCallback, useMemo } from 'react';
import React from 'react';

import {
  getComponentClientTransformer,
  getComponentDefaultData,
  getComponentMeta,
  getComponentPathWalker,
  getComponentValidator,
  importComponent,
} from '@/connector/component';
import { getEntitySharedContext } from '@/connector/entity';

const getCachedComponent = createCachedFactory(
  <Id extends ComponentId>(id: Id) => {
    return React.lazy(async () => {
      const module = await importComponent(id);

      return { default: module.renderer };
    });
  }
);

export function EntityHubProvider({ children }: PropsWithChildren) {
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
      getDefaultData: (id, options) => {
        return getComponentDefaultData(id, options, defaultDataContext);
      },
    }),
    []
  );

  const clientDefaultDataContext = useMemo(
    (): ForeignComponentClientDefaultDataContext => ({
      getDefaultData: <Id extends ComponentId, Args>(
        id: Id,
        options: ComponentClientOptionsById<Id, Args>
      ) => {
        const resolver = getComponentClientTransformer(id);

        if (resolver) {
          return resolver.getDefaultData(options, clientDefaultDataContext);
        }

        return defaultDataContext.getDefaultData(
          id,
          options
        ) as ComponentClientDataById<Id, Args>;
      },
    }),
    [defaultDataContext]
  );

  const getClientDataResolverContext = useCallback(
    async (id: EntityId) => {
      const sharedContext = await getEntitySharedContext(id);

      const clientTransformerContext: ForeignComponentClientDataTransformerContext =
        {
          idSource: incrementingIdSource,
          sharedContext,
          validation: validationContext,
          getDefaultData: clientDefaultDataContext.getDefaultData,
          fromClient: <Id extends ComponentId, Args>(
            id: Id,
            clientData: ComponentClientDataById<Id, Args>,
            options: ComponentClientOptionsById<Id, Args>
          ) => {
            const resolver = getComponentClientTransformer(id);

            const response = resolver
              ? resolver.fromClient(
                  clientData,
                  options,
                  clientTransformerContext
                )
              : { result: clientData as ComponentInDataById<Id, Args> };

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
            data: ComponentOutDataById<Id, Args>,
            options: ComponentClientOptionsById<Id, Args>
          ) => {
            const resolver = getComponentClientTransformer(id);

            return resolver
              ? resolver.toClient(data, options, clientTransformerContext)
              : (data as ComponentClientDataById<Id, Args>);
          },
        };

      return clientTransformerContext;
    },
    [validationContext, clientDefaultDataContext]
  );

  const pathWalkerContext = useMemo(
    (): ForeignComponentPathWalkerContext => ({
      applyAtPath(id, data, options, path, apply) {
        const pathWalker = getComponentPathWalker(id);

        if (pathWalker !== undefined) {
          pathWalker(data, options, path, apply, pathWalkerContext);
        } else {
          apply(data);
        }
      },
    }),
    []
  );

  const api = useMemo(
    (): ComponentApi => ({
      generateId: incrementingIdSource,
      getComponent: getCachedComponent,
      getDefaultData: clientDefaultDataContext.getDefaultData,
      getMeta: getComponentMeta,
      applyAtPath: pathWalkerContext.applyAtPath,
    }),
    [clientDefaultDataContext, pathWalkerContext]
  );

  const hub = useMemo(
    (): EntityHub => ({
      getClientDataResolverContext,
    }),
    [getClientDataResolverContext]
  );

  return (
    <ComponentApiContext.Provider value={api}>
      <EntityHubContext.Provider value={hub}>
        {children}
      </EntityHubContext.Provider>
    </ComponentApiContext.Provider>
  );
}
