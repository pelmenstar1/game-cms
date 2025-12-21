/* eslint-disable react-hooks/static-components */
import type { GameCmsClient } from '@game-cms/client';
import { createInMemoryCache } from '@game-cms/shared';
import type {
  ComponentDataById,
  ComponentErrorById,
  ComponentId,
  ComponentOptionsById,
} from '@game-cms/types';
import React, { Suspense, useMemo } from 'react';

import { useApiClient } from '@/hooks/useApiClient';
import { useStylesheetInject } from '@/hooks/useStylesheetInject';
import type { StylesheetInjectContextType } from '@/hooks/useStylesheetInject/context';
import { getCachedClientModule } from '@/services/component/clientModule';
import { getCachedComponentManifest } from '@/services/component/manifest';

export type RemoteComponentProps<T extends ComponentId = ComponentId> = {
  componentId: T;
  error?: ComponentErrorById<T>;
  options: ComponentOptionsById<T>;
  data: ComponentDataById<T>;
  onDataChanged?: (data: ComponentDataById<T>) => void;
};

type CreateLazyComponentContext = {
  client: GameCmsClient;
  stylesheetInject: StylesheetInjectContextType;
};

const componentCache = createInMemoryCache(
  (componentId: ComponentId, context: CreateLazyComponentContext) => {
    return React.lazy(async () => {
      const { stylesheetInject } = context;

      try {
        const manifest = await getCachedComponentManifest(componentId, context);

        stylesheetInject.addStylesheets(manifest.dependencies.css);

        const clientModule = await getCachedClientModule(componentId, context);

        return { default: clientModule.renderer };
      } catch (error: unknown) {
        console.error(error);

        return { default: () => <p>Failed to import component</p> };
      }
    });
  }
);

export function RemoteComponent<T extends ComponentId>({
  componentId,
  ...rest
}: RemoteComponentProps<T>) {
  const stylesheetInject = useStylesheetInject();
  const client = useApiClient();

  const Component = useMemo(
    () => componentCache.get(componentId, { client, stylesheetInject }),
    [stylesheetInject, client, componentId]
  );

  return (
    <Suspense fallback={'Loading'}>
      <Component {...rest} />
    </Suspense>
  );
}
