import type {
  ComponentData,
  ComponentId,
  ComponentOptions,
} from '@game-cms/types';
import React, { Suspense, useMemo } from 'react';

import { getComponentManifest } from '@/api/component';
import { getRendererFromModule } from '@/utils/component';

import { useStylesheetInject } from '../StylesheetInject/context';

export interface RemoteComponentProps {
  componentId: ComponentId;
  options: ComponentOptions;
  data: ComponentData;
}

export function RemoteComponent({
  componentId,
  options,
  data,
}: RemoteComponentProps) {
  const { addStylesheet } = useStylesheetInject();

  const Component = useMemo(() => {
    if (import.meta.env.SSR) {
      return () => null;
    }

    return React.lazy(async () => {
      try {
        const manifest = await getComponentManifest(componentId);
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
  }, [addStylesheet, componentId]);

  return (
    <Suspense fallback={'Loading'}>
      <Component options={options} data={data} />
    </Suspense>
  );
}
