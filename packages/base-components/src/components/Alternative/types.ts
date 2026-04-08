import { ConditionalData } from '@game-cms/conditional';
import {
  ComponentClientDataById,
  ComponentClientOptionsById,
  ComponentEntry,
  ComponentErrorById,
  ComponentId,
  ComponentInDataById,
  ComponentNestedPathDetails,
  ComponentNestedPathShape,
  ComponentOptionsById,
  ComponentOutDataById,
  ComponentResolvedDataById,
  ComponentSearchIndexDataById,
  ComponentStorageDataById,
} from '@game-cms/core';
import { IfExtends } from '@game-cms/shared';

export const id = 'base::alternative' as const;
export type Id = typeof id;

type AlternativeArgs<Id = ComponentId, BaseArgs = unknown> = {
  id: Id;
  baseArgs: BaseArgs;
};

type ResolveArgs<Args> = IfExtends<Args, AlternativeArgs>;

type Error<Args extends AlternativeArgs> = ComponentErrorById<
  Args['id'],
  Args['baseArgs']
>;

type AlternativeEntry<Args extends AlternativeArgs> = {
  options: {
    componentId: Args['id'];
    baseOptions: ComponentOptionsById<Args['id'], Args['baseArgs']>;
  };
  clientOptions: {
    componentId: Args['id'];
    baseOptions: ComponentClientOptionsById<Args['id'], Args['baseArgs']>;
  };
  error: {
    ownError?: 'INVALID_TYPE';
    default?: Error<Args>;
    alternative?: {
      data: Error<Args> | undefined;
      condition: string | undefined;
    }[];
  };
  outData: ConditionalData<ComponentOutDataById<Args['id'], Args['baseArgs']>>;
  inData: ConditionalData<ComponentInDataById<Args['id'], Args['baseArgs']>>;
  resolvedData: ComponentResolvedDataById<Args['id'], Args['baseArgs']>;
  clientData: ConditionalData<
    ComponentClientDataById<Args['id'], Args['baseArgs']>,
    string
  >;
  storageData: ConditionalData<
    ComponentStorageDataById<Args['id'], Args['baseArgs']>
  >;
  searchIndexData: {
    default: ComponentSearchIndexDataById<Args['id'], Args['baseArgs']>;
    alternative: ComponentSearchIndexDataById<Args['id'], Args['baseArgs']>[];
  };
};

type UnpackShape<T> = T extends BaseNestedPathShape ? T['default'] : never;

type BaseNestedPath<
  T,
  Args extends AlternativeArgs,
> = ComponentNestedPathDetails<UnpackShape<T>, Args['id'], Args['baseArgs']>;

type BaseNestedPathShape<Args extends AlternativeArgs = AlternativeArgs> = {
  default: ComponentNestedPathShape<Args['id'], Args['baseArgs']>;
  alternative: {
    value: ComponentNestedPathShape<Args['id'], Args['baseArgs']>;
  }[];
};

declare module '@game-cms/core' {
  interface ComponentTypeMap<Args> {
    [id]: ComponentEntry<AlternativeEntry<ResolveArgs<Args>>>;
  }

  interface ComponentNestedPathMap<T, Args> {
    [id]: BaseNestedPath<T, ResolveArgs<Args>>;
  }

  interface ComponentNestedPathShapeMap<Args> {
    [id]: BaseNestedPathShape<ResolveArgs<Args>>;
  }
}
