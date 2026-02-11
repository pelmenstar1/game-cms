import { ConditionalData } from '@game-cms/conditional';
import {
  ComponentClientDataById,
  ComponentEntry,
  ComponentErrorById,
  ComponentId,
  ComponentNestedPathDetails,
  ComponentNestedPathShape,
  ComponentOptionsById,
  ComponentRawDataById,
  ComponentRawInDataById,
  ComponentResolvedDataById,
  ComponentSearchIndexDataById,
  ComponentStorageDataById,
} from '@game-cms/core';
import { IfExtends } from '@game-cms/shared';

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
  error: {
    ownError?: 'INVALID_TYPE';
    default?: Error<Args>;
    alternative?: {
      data: Error<Args> | undefined;
      condition: string | undefined;
    }[];
  };
  rawData: ConditionalData<ComponentRawDataById<Args['id'], Args['baseArgs']>>;
  rawInData: ConditionalData<
    ComponentRawInDataById<Args['id'], Args['baseArgs']>
  >;
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
  interface ComponentTypeMap<_Args> {
    'base::alternative': ComponentEntry<AlternativeEntry<ResolveArgs<_Args>>>;
  }

  interface ComponentNestedPathMap<T, Args> {
    'base::alternative': BaseNestedPath<T, ResolveArgs<Args>>;
  }

  interface ComponentNestedPathShapeMap<Args> {
    'base::alternative': BaseNestedPathShape<ResolveArgs<Args>>;
  }
}
