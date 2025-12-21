import type { MaybeAsyncFactory } from '@game-cms/shared';
import type { FC } from 'react';
import type { ZodType } from 'zod';

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
  name: string;
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

export type ComponentProps<
  Options extends ComponentOptions = ComponentOptions,
  Data extends ComponentData = ComponentData,
  Error = unknown,
> = {
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

type ComponentPropsFromController<Controller> =
  Controller extends ComponentController<infer Options, infer Data, infer Error>
    ? ComponentProps<Options, Data, Error>
    : ComponentProps;

export type ComponentPropsById<Id extends ComponentId = ComponentId> =
  ComponentPropsFromController<GetComponentControllerById<Id>>;

export type ComponentRenderer<Id extends ComponentId = ComponentId> = FC<
  ComponentPropsById<Id>
>;

export type ComponentControllerConfig = {
  ui?: {
    compact?: boolean;
  };
};

export type ComponentDataValidator<
  Options extends ComponentOptions = ComponentOptions,
  Data extends ComponentData = ComponentData,
  Error = unknown,
> = (data: Data, options: Options) => Error | undefined;

export interface ComponentController<
  Options extends ComponentOptions = ComponentOptions,
  Data extends ComponentData = ComponentData,
  Error = unknown,
  Id extends string = string,
> {
  id: Id;
  config?: ComponentControllerConfig;
  validation: {
    options: ZodType<Options>;
    data: ComponentDataValidator<Options, Data, Error>;
  };
  default: {
    options(): Options;
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

export type ComponentClientRenderManifest = {
  main: string;
  dependencies: {
    css: string[];
  };
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
  validator?: ComponentDataValidator<
    ComponentOptionsById<Id>,
    ComponentDataById<Id>,
    ComponentErrorById<Id>
  >;
  renderer: ComponentRenderer<Id>;
};
