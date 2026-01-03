import { ConditionalData } from '@game-cms/conditional';
import {
  ComponentClientDataById,
  ComponentEntry,
  ComponentErrorById,
  ComponentId,
  ComponentOptionsById,
  ComponentRawDataById,
  ComponentStorageDataById,
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

type Data<Args extends AlternativeArgs> = ComponentRawDataById<
  Args['id'],
  Args['baseArgs']
>;

type AlternativeEntry<Args extends AlternativeArgs> = {
  rawData: ConditionalData<Data<Args>>;
  options: {
    componentId: Args['id'];
    baseOptions: ComponentOptionsById<Args['id'], Args['baseArgs']>;
  };
  error: {
    default: Error<Args> | undefined;
    alternative: {
      data: Error<Args> | undefined;
      condition: string | undefined;
    }[];
  };
  resolvedData: Data<Args>;
  clientData: ConditionalData<
    ComponentClientDataById<Args['id'], Args['baseArgs']>,
    string
  >;
  storageData: ConditionalData<
    ComponentStorageDataById<Args['id'], Args['baseArgs']>
  >;
};

declare module '@game-cms/core' {
  interface ComponentTypeMap<_Args> {
    'base::alternative': ComponentEntry<AlternativeEntry<ResolveArgs<_Args>>>;
  }
}
