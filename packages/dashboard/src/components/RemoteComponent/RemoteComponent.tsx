import { getComponentManifest } from '@game-cms/client';
import type {
  ComponentId,
  GetComponentControllerById,
  InferComponentData,
  InferComponentOptions,
} from '@game-cms/types';
import React, { Suspense, useMemo } from 'react';

import { useApiClient } from '@/hooks/useApiClient';
import { useStylesheetInject } from '@/hooks/useStylesheetInject';
import { getRendererFromModule } from '@/utils/component';

export interface RemoteComponentProps<T extends ComponentId> {
  componentId: T;
  options: InferComponentOptions<GetComponentControllerById<T>>;
  data: InferComponentData<GetComponentControllerById<T>>;
}

export function RemoteComponent<T extends ComponentId>({
  componentId,
  options,
  data,
}: RemoteComponentProps<T>) {
  const { addStylesheet } = useStylesheetInject();
  const client = useApiClient();

  const Component = useMemo(() => {
    return React.lazy(async () => {
      try {
        const manifest = await getComponentManifest({ client }, componentId);
        for (const url of manifest.cssBundles) {
          addStylesheet(url);
        }

        const component: unknown = await import(
          /* @vite-ignore */
          manifest.jsBundle
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
      <Component options={options} data={data} />
    </Suspense>
  );
}
