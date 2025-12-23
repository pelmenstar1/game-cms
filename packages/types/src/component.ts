import type { MaybeAsyncFactory } from '@game-cms/shared';
import type { FC } from 'react';

import type { DefaultExport, IdArrayToMap } from './typeutil.js';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ComponentMap extends Record<string, ComponentController> {}

export type ComponentId = keyof ComponentMap;

export type ComponentDataAtom = string | number | boolean | null;
export type ComponentData =
  | ComponentDataAtom
  | ComponentData[]
  | { [K in string]: ComponentData };

export type ComponentOptions = ComponentData;

export type BaseComponentSchema<
  Options extends ComponentOptions,
  Controller,
> = {
  config?: ComponentControllerConfig;
  options: Options;
  controller: Controller;
};

export type ServerComponentSchema<
  Options extends ComponentOptions = ComponentOptions,
  Data extends ComponentData = ComponentData,
  Error = unknown,
  Id extends string = string,
> = BaseComponentSchema<Options, ComponentController<Options, Data, Error, Id>>;

export interface ClientComponentSchema<
  Options extends ComponentOptions = ComponentOptions,
  Data extends ComponentData = ComponentData,
> extends BaseComponentSchema<Options, ComponentId> {
  defaultData: Data;
}

export type ComponentApi = {
  getDefaultData: <Id extends ComponentId>(id: Id) => ComponentDataById<Id>;
  getComponent: <Id extends ComponentId>(
    id: Id
  ) => ForeignComponentRenderer<Id>;
};

export type ComponentProps<
  Options extends ComponentOptions = ComponentOptions,
  Data extends ComponentData = ComponentData,
  Error = unknown,
> = {
  api: ComponentApi;
  data: Data;
  options: Options;
  error?: Error;
  onDataChanged?: (data: Data) => void;
};

export type GetComponentControllerById<Id extends ComponentId> =
  ComponentMap[Id];

type InferControllerParams<Controller> =
  Controller extends ComponentController<
    infer Options,
    infer Data,
    infer Error,
    infer Id
  >
    ? {
        options: Options;
        data: Data;
        error: Error;
        id: Id;
      }
    : never;

export type InferComponentOptions<Controller> =
  InferControllerParams<Controller>['options'];

export type InferComponentData<Controller> =
  InferControllerParams<Controller>['data'];

export type InferComponentError<Controller> =
  InferControllerParams<Controller>['error'];

export type ComponentDataById<T extends ComponentId> = InferComponentData<
  GetComponentControllerById<T>
>;

export type ComponentOptionsById<T extends ComponentId> = InferComponentOptions<
  GetComponentControllerById<T>
>;

export type ComponentErrorById<T extends ComponentId> = InferComponentError<
  GetComponentControllerById<T>
>;

export type ComponentPropsById<Id extends ComponentId = ComponentId> =
  ComponentProps<
    ComponentOptionsById<Id>,
    ComponentDataById<Id>,
    ComponentErrorById<Id>
  >;

export type ComponentRenderer<Id extends ComponentId = ComponentId> = FC<
  ComponentPropsById<Id>
>;

export type ForeignComponentRenderer<Id extends ComponentId = ComponentId> = FC<
  Omit<ComponentPropsById<Id>, 'api'>
>;

export type ComponentControllerConfig = {
  ui?: {
    compact?: boolean;
  };
};

export type ForeignComponentContext = {
  validation: {
    data: <Id extends ComponentId>(id: Id) => ComponentDataValidatorById<Id>;
  };
  default: {
    data: <Id extends ComponentId>(id: Id) => ComponentDataById<Id>;
  };
};

export type ComponentDataValidator<
  Options extends ComponentOptions = ComponentOptions,
  Data extends ComponentData = ComponentData,
  Error = unknown,
> = (
  data: Data,
  options: Options,
  context: Pick<ForeignComponentContext, 'validation'>
) => Error | undefined;

export type ComponentDataValidatorById<Id extends ComponentId> =
  ComponentDataValidator<
    ComponentOptionsById<Id>,
    ComponentDataById<Id>,
    ComponentErrorById<Id>
  >;

export interface ComponentControllerProtocol<
  Options extends ComponentOptions = ComponentOptions,
  Data extends ComponentData = ComponentData,
  Error = unknown,
> {
  validation: {
    data: ComponentDataValidator<Options, Data, Error>;
  };
  default: {
    data: (context: Pick<ForeignComponentContext, 'default'>) => NoInfer<Data>;
  };
}

export interface ComponentController<
  Options extends ComponentOptions = ComponentOptions,
  Data extends ComponentData = ComponentData,
  Error = unknown,
  Id extends string = string,
> {
  id: Id;
  config?: ComponentControllerConfig;
  validation: {
    data: ComponentDataValidator<Options, Data, Error>;
  };
  default: {
    data(): NoInfer<Data>;
  };
}

export type FileSource = MaybeAsyncFactory<string>;

export interface ComponentRendererDependencies {
  js: Record<string, FileSource>;
  css: Record<string, FileSource>;
}

export interface ComponentRenderManifest {
  main: FileSource;
  dependencies: ComponentRendererDependencies;
}

export type ComponentClientManifest<Id extends ComponentId> = {
  defaultData: ComponentDataById<Id>;
  source: {
    main: string;
    dependencies: {
      css: string[];
    };
  };
};

export type ComponentClientManifestMap = {
  [Id in ComponentId]: ComponentClientManifest<Id>;
};

export type ComponentStaticConfig<Id extends ComponentId = ComponentId> = {
  controller: GetComponentControllerById<Id>;
  renderManifest: ComponentRenderManifest;
};

export type ComponentStaticConfigMap<K extends string | number = ComponentId> =
  {
    [Id in K]: ComponentStaticConfig<Id>;
  };

export type ResolveComponents<T extends DefaultExport<{ id: string }>[]> =
  IdArrayToMap<T>;

export type ComponentClientModule<Id extends ComponentId = ComponentId> = {
  validator?: ComponentDataValidatorById<Id>;
  renderer: ComponentRenderer<Id>;
};
