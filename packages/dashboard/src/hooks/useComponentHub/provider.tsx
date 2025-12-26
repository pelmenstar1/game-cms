import {
  type ComponentApi,
  ComponentApiContext,
} from '@game-cms/component-api';
import { createInMemoryCache } from '@game-cms/shared';
import type { ComponentId, ForeignComponentContext } from '@game-cms/types';
import { type PropsWithChildren, useMemo } from 'react';
import React from 'react';
import {
  getComponentDefaultData,
  getComponentValidator,
  importComponent,
} from 'virtual:dashboard/componentConnector';

import { type ComponentHub, ComponentHubContext } from './context';

const componentCache = createInMemoryCache((id: ComponentId) =>
  React.lazy(async () => {
    const module = await importComponent(id);

    return { default: module.renderer };
  })
);

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
      data: (id, options) => {
        return getComponentDefaultData(id, options, defaultDataContext);
      },
    }),
    []
  );

  const api = useMemo(
    (): ComponentApi => ({
      getDefaultData: defaultDataContext.data,
      getComponent: (id) => componentCache.get(id, api),
    }),
    [defaultDataContext]
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
