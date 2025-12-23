import { getComponentManifest } from '@game-cms/client';
import type {
  ComponentApi,
  ComponentClientModule,
  ComponentId,
  ForeignComponentContext,
  ForeignComponentRenderer,
} from '@game-cms/types';
import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useApiQuery } from '../useApiQuery';
import { useStylesheetInject } from '../useStylesheetInject';
import { type ComponentHub, ComponentHubContext } from './context';

type ClientModuleMap = {
  [K in ComponentId]: ComponentClientModule<K>;
};

type ComponentMap = {
  [K in ComponentId]?: ForeignComponentRenderer<K>;
};

export function ComponentHubProvider({ children }: PropsWithChildren) {
  const [manifestResult] = useApiQuery(getComponentManifest);

  const stylesheetInject = useStylesheetInject();
  const [clientBundles, setClientBundles] = useState<ClientModuleMap | null>(
    null
  );

  const componentCache = useRef<ComponentMap>({});

  const loaded = clientBundles !== null;

  useEffect(() => {
    if (manifestResult.status === 'success') {
      const manifestMap = manifestResult.value;

      const worker = async () => {
        const entries = await Promise.all(
          Object.entries(manifestMap).map(async ([id, manifest]) => {
            const clientModule: unknown = await import(manifest.source.main);

            return [id, clientModule as ComponentClientModule] as const;
          })
        );

        setClientBundles(Object.fromEntries(entries));
      };

      void worker();
    }
  }, [manifestResult]);

  const getLoadedComponentManifest = useCallback(
    <Id extends ComponentId>(id: Id) => {
      const manifest =
        manifestResult.status === 'success'
          ? manifestResult.value[id]
          : undefined;

      if (!manifest) {
        throw new Error('Hub is not loaded');
      }
      return manifest;
    },
    [manifestResult]
  );

  const api = useMemo(
    (): ComponentApi => ({
      getDefaultData: (id) => {
        const manifest = getLoadedComponentManifest(id);

        return manifest.defaultData;
      },
      getComponent: <Id extends ComponentId>(id: Id) => {
        const manifest = getLoadedComponentManifest(id);

        const bundle = clientBundles?.[id];
        if (!bundle) {
          throw new Error('Hub is not loaded');
        }

        const BaseComponent = bundle.renderer;
        let result = componentCache.current[id];

        if (!result) {
          result = (props) => {
            const componentProps = { api, ...props };

            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
              stylesheetInject.addStylesheets(manifest.source.dependencies.css);
            }, []);

            return <BaseComponent {...componentProps} />;
          };

          componentCache.current[id] = result;
        }

        return result;
      },
    }),
    [clientBundles, getLoadedComponentManifest, stylesheetInject]
  );

  const validationContext = useMemo(
    (): Pick<ForeignComponentContext, 'validation'> => ({
      validation: {
        data: (id) => {
          const bundle = clientBundles?.[id];
          if (!bundle) {
            throw new Error('Hub is not loaded');
          }

          return bundle.validator ?? (() => undefined);
        },
      },
    }),
    [clientBundles]
  );

  const hub = useMemo(
    (): ComponentHub => ({
      loaded,
      api,
      validationContext,
    }),
    [api, loaded, validationContext]
  );

  return (
    <ComponentHubContext.Provider value={hub}>
      {children}
    </ComponentHubContext.Provider>
  );
}
