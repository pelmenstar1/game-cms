import { getComponentManifest } from '@game-cms/client';
import type {
  ComponentDataById,
  ComponentId,
  ComponentOptionsById,
} from '@game-cms/types';
import React, { Suspense, useMemo } from 'react';

import { useApiClient } from '@/hooks/useApiClient';
import { useStylesheetInject } from '@/hooks/useStylesheetInject';
import { getRendererFromModule } from '@/utils/component';

export type RemoteComponentProps<T extends ComponentId> = {
  componentId: T;
  options: ComponentOptionsById<T>;
  data: ComponentDataById<T>;
  onDataChanged?: (data: ComponentDataById<T>) => void;
};

export function RemoteComponent<T extends ComponentId>({
  componentId,
  ...rest
}: RemoteComponentProps<T>) {
  const { addStylesheet } = useStylesheetInject();
  const client = useApiClient();

  const Component = useMemo(() => {
    return React.lazy(async () => {
      try {
        const manifest = await getComponentManifest({ client }, componentId);
        for (const url of manifest.dependencies.css) {
          addStylesheet(url);
        }

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
  }, [addStylesheet, client, componentId]);

  return (
    <Suspense fallback={'Loading'}>
      <Component {...rest} />
    </Suspense>
  );
}
