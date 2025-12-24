import type {
  ComponentApi,
  ComponentClientModule,
  ComponentId,
  ForeignComponentContext,
  ForeignComponentRenderer,
} from '@game-cms/types';
import {
  type PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  getComponentDefaultData,
  getComponentIds,
  importComponent,
} from 'virtual:dashboard/componentConnector';

import { type ComponentHub, ComponentHubContext } from './context';

type ClientModuleMap = {
  [K in ComponentId]: ComponentClientModule<K>;
};

type ComponentMap = {
  [K in ComponentId]?: ForeignComponentRenderer<K>;
};

export function ComponentHubProvider({ children }: PropsWithChildren) {
  const [clientBundles, setClientBundles] = useState<ClientModuleMap | null>(
    null
  );

  const componentCache = useRef<ComponentMap>({});

  const loaded = clientBundles !== null;

  useEffect(() => {
    const worker = async () => {
      const entries = await Promise.all(
        getComponentIds().map(async (id) => {
          const clientModule = await importComponent(id);

          return [id, clientModule as ComponentClientModule] as const;
        })
      );

      setClientBundles(Object.fromEntries(entries));
    };

    void worker();
  }, []);

  const api = useMemo(
    (): ComponentApi => ({
      getDefaultData: getComponentDefaultData,
      getComponent: <Id extends ComponentId>(id: Id) => {
        const bundle = clientBundles?.[id];
        if (!bundle) {
          throw new Error('Hub is not loaded');
        }

        const BaseComponent = bundle.renderer;
        let result = componentCache.current[id];

        if (!result) {
          result = (props) => {
            return <BaseComponent api={api} {...props} />;
          };

          componentCache.current[id] = result;
        }

        return result;
      },
    }),
    [clientBundles]
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
