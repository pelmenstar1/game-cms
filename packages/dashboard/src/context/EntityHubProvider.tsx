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
  ForeignComponentClientValidationContext,
  ForeignComponentDefaultDataContext,
  ForeignComponentPathWalkerContext,
} from '@game-cms/core';
import { createCachedFactory, incrementingIdSource } from '@game-cms/shared';
import type { PropsWithChildren } from 'react';
import React from 'react';

import {
  getComponentClientController,
  getComponentDefaultOutData,
  getComponentPathWalker,
  hasComponentRenderer,
  importRendererModule,
} from '@/connector/component';
import { getEntitySharedContext } from '@/connector/entity';

const getCachedComponent = createCachedFactory(
  <Id extends ComponentId>(id: Id) => {
    return React.lazy(async () => {
      const module = await importRendererModule(id, 'default');

      return { default: module.renderer };
    });
  }
);

const getComponentMeta = (id: ComponentId) => {
  return getComponentClientController(id).meta;
};

const validationContext: ForeignComponentClientValidationContext = {
  validate: (id, data, options) => {
    const { validator } = getComponentClientController(id);

    return validator(data, options, validationContext);
  },
};

const pathWalkerContext: ForeignComponentPathWalkerContext = {
  applyAtPath(id, data, options, path, apply) {
    const pathWalker = getComponentPathWalker(id);

    if (pathWalker !== undefined) {
      pathWalker(data, options, path, apply, pathWalkerContext);
    } else {
      apply(data, id, options);
    }
  },
};

const defaultDataContext: ForeignComponentDefaultDataContext = {
  getDefaultData: (id, options) => {
    return getComponentDefaultOutData(id, options, defaultDataContext);
  },
};

const clientDefaultDataContext: ForeignComponentClientDefaultDataContext = {
  getDefaultData: <Id extends ComponentId, Args>(
    id: Id,
    options: ComponentClientOptionsById<Id, Args>
  ) => {
    const { getDefaultData } = getComponentClientController(id);

    if (getDefaultData) {
      return getDefaultData(options, clientDefaultDataContext);
    }

    return defaultDataContext.getDefaultData(
      id,
      options
    ) as ComponentClientDataById<Id, Args>;
  },
};

const getClientDataResolverContext = async (id: EntityId) => {
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
        const { transformer } = getComponentClientController(id);

        if (transformer) {
          return transformer.fromClient(
            clientData,
            options,
            clientTransformerContext
          );
        }

        return clientData as ComponentInDataById<Id, Args>;
      },
      toClient: <Id extends ComponentId, Args>(
        id: Id,
        data: ComponentOutDataById<Id, Args>,
        options: ComponentClientOptionsById<Id, Args>
      ) => {
        const { transformer } = getComponentClientController(id);

        if (transformer) {
          return transformer.toClient(data, options, clientTransformerContext);
        }

        return data as ComponentClientDataById<Id, Args>;
      },
    };

  return clientTransformerContext;
};

const api: ComponentApi = {
  generateId: incrementingIdSource,
  getDefaultRenderer: getCachedComponent,
  getMeta: getComponentMeta,
  getRendererByVariant: importRendererModule,
  hasRendererByVariant: hasComponentRenderer,
  getDefaultData: clientDefaultDataContext.getDefaultData,
  validate: validationContext.validate,
  applyAtPath: pathWalkerContext.applyAtPath,
};

const hub: EntityHub = {
  getClientDataResolverContext,
};

export function EntityHubProvider({ children }: PropsWithChildren) {
  return (
    <ComponentApiContext.Provider value={api}>
      <EntityHubContext.Provider value={hub}>
        {children}
      </EntityHubContext.Provider>
    </ComponentApiContext.Provider>
  );
}
