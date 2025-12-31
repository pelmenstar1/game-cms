import type { IdSource, Or } from '@game-cms/shared';
import type { Key, ReactNode } from 'react';

import type { DefaultExport, IdArrayToMap } from './typeutil.js';

export type ComponentDataAtom = unknown; // string | number | boolean | null;
export type ComponentData =
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  ComponentDataAtom | ComponentData[] | { [K in string]: ComponentData };

export type ComponentOptions = ComponentData;

export type ComponentTypes = {
  data: ComponentData;
  options: ComponentOptions;
  error: unknown;
};

export type ComponentEntry<T extends ComponentTypes> = T;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars
export interface ComponentTypeMap<_Args = unknown> extends Record<
  string,
  ComponentTypes
> {}

export type ComponentId = keyof ComponentTypeMap;

export type ComponentSchema<
  Id extends ComponentId = ComponentId,
  Args = unknown,
> = {
  config?: ComponentControllerConfig;
  options: ComponentOptionsById<Id, Args>;
  componentId: Id;
};

type GetComponentTypes<Types extends ComponentTypes> = {
  options: Types['options'];
  data: Types['data'];
  error: Types['error'];
  resolvedData: Types extends { resolvedData: unknown }
    ? Types['resolvedData']
    : Types['data'];
  clientData: Types extends { clientData: unknown }
    ? Types['clientData']
    : Types['data'];
};

type GetComponentTypesById<
  Id extends ComponentId,
  Args = unknown,
> = GetComponentTypes<ComponentTypeMap<Args>[Id]>;

export type ComponentDataById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['data'];

export type ComponentResolvedDataById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['resolvedData'];

export type ComponentClientDataById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['clientData'];

export type ComponentOptionsById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['options'];

export type ComponentErrorById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['error'];

export type ComponentProps<Id extends ComponentId, Args> = {
  data: ComponentClientDataById<Id, Args>;
  options: ComponentOptionsById<Id, Args>;
  error?: ComponentErrorById<Id, Args>;
  onDataChanged?: (data: ComponentClientDataById<Id, Args>) => void;
};

export type ComponentRenderer<Id extends ComponentId = ComponentId> = <
  Args = unknown,
>(
  props: ComponentProps<Id, Args>
) => ReactNode;

export type ComponentControllerConfig = {
  ui?: {
    compact?: boolean;
  };
};

export type ForeignComponentContext = {
  validation: {
    data: <Id extends ComponentId, Args>(
      id: Id,
      data: ComponentDataById<Id, Args>,
      options: ComponentOptionsById<Id, Args>
    ) => ComponentErrorById<Id, Args> | undefined;
  };
  default: {
    data: <Id extends ComponentId, Args>(
      id: Id,
      options: ComponentOptionsById<Id, Args>
    ) => ComponentDataById<Id, Args>;
  };
  resolver: {
    data: <Id extends ComponentId, Args>(
      id: Id,
      data: ComponentDataById<Id, Args>,
      options: ComponentOptionsById<Id, Args>,
      args: ComponentDataResolverArgs
    ) => ComponentResolvedDataById<Id>;
  };
  clientResolver: {
    idSource: IdSource<Key>;

    toClient: <Id extends ComponentId, Args>(
      id: Id,
      data: ComponentDataById<Id, Args>,
      options: ComponentOptionsById<Id, Args>
    ) => ComponentClientDataById<Id, Args>;

    fromClient: <Id extends ComponentId, Args>(
      id: Id,
      clientData: ComponentClientDataById<Id, Args>,
      options: ComponentOptionsById<Id, Args>
    ) => Or<
      { result: ComponentDataById<Id, Args> },
      { error: ComponentErrorById<Id, Args> }
    >;
  };
};

export type ComponentDataValidator<Id extends ComponentId> = <Args = unknown>(
  data: ComponentDataById<Id, Args>,
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentContext['validation']
) => ComponentErrorById<Id, Args> | undefined;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ComponentDataResolverArgs {}

export type ComponentDataResolver<Id extends ComponentId, Args = unknown> = (
  raw: ComponentDataById<Id, Args>,
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentContext['resolver'],
  args: ComponentDataResolverArgs
) => ComponentResolvedDataById<Id, Args>;

export type ComponentDataOrError<Id extends ComponentId, Args = unknown> =
  | { result: ComponentDataById<Id, Args> }
  | { error: ComponentErrorById<Id, Args> };

export type ComponentClientDataResolver<Id extends ComponentId> = {
  toClient: <Args>(
    data: ComponentDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentContext['clientResolver']
  ) => ComponentClientDataById<Id, Args>;

  fromClient: <Args>(
    clientData: ComponentClientDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentContext['clientResolver']
  ) => ComponentDataOrError<Id, Args>;
};

export type ComponentMeta<Id extends ComponentId = ComponentId> = {
  id: Id;
  config?: ComponentControllerConfig;
  defaultData:
    | ComponentDataById<Id>
    | (<Args>(
        options: ComponentOptionsById<Id, Args>,
        context: ForeignComponentContext['default']
      ) => ComponentDataById<Id, Args>);
};

export interface ComponentController<
  Id extends ComponentId = ComponentId,
  Args = unknown,
> {
  meta: ComponentMeta<Id>;
  resolver?: ComponentDataResolver<Id, Args>;
  validator: ComponentDataValidator<Id>;
}

export type ComponentControllerMap = {
  [Id in keyof ComponentTypeMap]: ComponentController<Id>;
};

export type ResolveComponents<T extends DefaultExport<{ id: string }>[]> =
  IdArrayToMap<T>;

export type ComponentClientModule<Id extends ComponentId = ComponentId> = {
  dataResolver: ComponentClientDataById<Id>;
  renderer: ComponentRenderer<Id>;
};

export type ComponentsFsInfo = {
  distributions: string[];
};
