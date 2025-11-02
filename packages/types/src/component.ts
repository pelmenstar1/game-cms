import type { MaybeFactory } from '@game-cms/shared';
import type { FC } from 'react';
import { type ZodType } from 'zod';

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
  options: Options;
  controller: Controller;
};

export type ServerComponentSchema<
  Options extends ComponentOptions = ComponentOptions,
  Data extends ComponentData = ComponentData,
> = BaseComponentSchema<Options, ComponentController<Options, Data>>;

export type ClientComponentSchema<Options extends ComponentOptions> =
  BaseComponentSchema<Options, ComponentId>;

export type ComponentProps<
  Options extends ComponentOptions = ComponentOptions,
  Data extends ComponentData = ComponentData,
> = {
  data: Data;
  options: Options;
};

export type GetComponentControllerById<Id extends ComponentId> =
  ComponentMap[Id];

export type InferComponentOptions<Controller> =
  Controller extends ComponentController<infer Options> ? Options : never;

export type InferComponentData<Controller> =
  Controller extends ComponentController<ComponentOptions, infer Data>
    ? Data
    : never;

type ComponentPropsFromController<Controller> =
  Controller extends ComponentController<infer Options, infer Data>
    ? ComponentProps<Options, Data>
    : ComponentProps;

export type ComponentRenderer<Id extends ComponentId = ComponentId> = FC<
  ComponentPropsFromController<GetComponentControllerById<Id>>
>;

export interface ComponentController<
  Options extends ComponentOptions = ComponentOptions,
  Data extends ComponentData = ComponentData,
> {
  id: string;

  validation: {
    options: ZodType<Options>;
    data: MaybeFactory<ZodType<Data>, [Options]>;
  };

  default: {
    options(): Options;
    data(): Data;
  };
}

export interface ComponentRenderManifest {
  jsBundle: string;
  jsDependencies: string[];
  cssBundles: string[];
}

export type ComponentStaticConfig<Id extends ComponentId = ComponentId> = {
  baseDirectory: string;
  controller: GetComponentControllerById<Id>;
  renderManifest: ComponentRenderManifest;
};

export type ComponentStaticConfigMap = {
  [Id in ComponentId]: ComponentStaticConfig<Id>;
};
