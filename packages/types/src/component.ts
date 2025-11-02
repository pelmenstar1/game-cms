import type { FC } from 'react';
import z, { type ZodType } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ComponentMap extends Record<string, ComponentController> {}

export type ComponentId = keyof ComponentMap;

export type ComponentDataAtom = string | number | boolean | null;
export type ComponentData =
  | ComponentDataAtom
  | ComponentData[]
  | { [K in string]: ComponentData };

export type ComponentOptions = ComponentData;

export const componentSchema = z.object({
  componentId: z.string(),
  name: z.string(),
  options: z.unknown(),
});

export type ComponentSchema = z.infer<typeof componentSchema>;

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

export type MaybeOptions<T, Options> = T | ((options: Options) => T);

export interface ComponentController<
  Options extends ComponentOptions = ComponentOptions,
  Data extends ComponentData = ComponentData,
> {
  id: string;

  validation: {
    options: ZodType<Options>;
    data: MaybeOptions<ZodType<Data>, Options>;
  };

  defaultOptions(): Options;
  defaultData(): Data;

  isValid: (options: Options, data: Data) => boolean;
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
