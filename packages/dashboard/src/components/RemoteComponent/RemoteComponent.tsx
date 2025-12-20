/* eslint-disable react-hooks/static-components */
import { type GameCmsClient, getComponentManifest } from '@game-cms/client';
import type {
  ComponentDataById,
  ComponentId,
  ComponentOptionsById,
  ComponentProps,
} from '@game-cms/types';
import React, { type FC, Suspense, useMemo } from 'react';

import { useApiClient } from '@/hooks/useApiClient';
import { useStylesheetInject } from '@/hooks/useStylesheetInject';
import type { StylesheetInjectContextType } from '@/hooks/useStylesheetInject/context';
import { getRendererFromModule } from '@/utils/component';

export type RemoteComponentProps<T extends ComponentId = ComponentId> = {
  componentId: T;
  options: ComponentOptionsById<T>;
  data: ComponentDataById<T>;
  onDataChanged?: (data: ComponentDataById<T>) => void;
};

type CreateLazyComponentContext = {
  client: GameCmsClient;
  componentId: ComponentId;
  stylesheetInject: StylesheetInjectContextType;
};

const componentCache: Record<ComponentId, FC<ComponentProps> | undefined> = {};

function createLazyComponent(context: CreateLazyComponentContext) {
  return React.lazy(async () => {
    const { client, componentId, stylesheetInject } = context;

    try {
      const manifest = await getComponentManifest({ client }, componentId);
      stylesheetInject.addStylesheets(manifest.dependencies.css);

      const component: unknown = await import(
        /* @vite-ignore */
        manifest.main
      );

      return { default: getRendererFromModule(component) };
    } catch (error: unknown) {
      console.error(error);

      return { default: () => <p>Failed to import component</p> };
    }
  });
}

function getCachedLazyComponent(context: CreateLazyComponentContext) {
  const { componentId } = context;

  let result = componentCache[componentId];
  if (result === undefined) {
    result = createLazyComponent(context);
    componentCache[componentId] = result;
  }

  return result;
}

export function RemoteComponent<T extends ComponentId>({
  componentId,
  ...rest
}: RemoteComponentProps<T>) {
  const stylesheetInject = useStylesheetInject();
  const client = useApiClient();

  const Component = useMemo(
    () => getCachedLazyComponent({ client, componentId, stylesheetInject }),
    [stylesheetInject, client, componentId]
  );

  return (
    <Suspense fallback={'Loading'}>
      <Component {...rest} />
    </Suspense>
  );
}
