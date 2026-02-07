import { ConditionalData } from '@game-cms/conditional';
import {
  ComponentClientDataById,
  ComponentEntry,
  ComponentErrorById,
  ComponentId,
  ComponentNestedPath,
  ComponentNestedPathShape,
  ComponentOptionsById,
  ComponentRawDataById,
  ComponentRawInDataById,
  ComponentResolvedDataById,
  ComponentSearchIndexDataById,
  ComponentStorageDataById,
  ParseComponentNestedPath,
} from '@game-cms/core';

type AlternativeArgs<Id = ComponentId, BaseArgs = unknown> = {
  id: Id;
  baseArgs: BaseArgs;
};

type ResolveArgs<Args> = Args extends {
  id: infer Id extends ComponentId;
  baseArgs: infer BaseArgs;
}
  ? AlternativeArgs<Id, BaseArgs>
  : AlternativeArgs;

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

type BaseNestedPath<T, Args extends AlternativeArgs> = {
  path: ComponentNestedPath<T, Args['id'], Args['baseArgs']>;
};

type BaseNestedPathShape<Args extends AlternativeArgs> = {
  default: ComponentNestedPathShape<Args['id'], Args['baseArgs']>;
  alternative: {
    value: ComponentNestedPathShape<Args['id'], Args['baseArgs']>;
  }[];
};

type BaseParseNestedPath<T, Path extends string, Args extends AlternativeArgs> =
  T extends BaseNestedPathShape<Args>
    ? ParseComponentNestedPath<T['default'], Path, Args['id'], Args['baseArgs']>
    : unknown;

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

  interface ComponentNestedPathParserMap<T, Path extends string, Args> {
    'base::alternative': BaseParseNestedPath<T, Path, ResolveArgs<Args>>;
  }
}
