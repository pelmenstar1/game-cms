import type {
  ComponentClientDataById,
  ComponentEntry,
  ComponentErrorById,
  ComponentId,
  ComponentOptionsById,
  ComponentRawDataById,
  ComponentResolvedDataById,
  ComponentStorageDataById,
} from '@game-cms/core';

export type SpritesheetArgs<
  Id extends ComponentId = ComponentId,
  Args = unknown,
> = {
  id: Id;
  baseArgs: Args;
};

type ResolveSpritesheetArgs<Args> =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Args extends SpritesheetArgs<infer _Id extends ComponentId, infer _BaseArgs>
    ? Args
    : SpritesheetArgs;

type SpritesheetEntry<Args extends SpritesheetArgs> = {
  rawData: ComponentRawDataById<Args['id'], Args['baseArgs']>;
  options: {
    componentId: Args['id'];
    baseOptions: ComponentOptionsById<Args['id'], Args['baseArgs']>;
  };
  error: ComponentErrorById<Args['id'], Args['baseArgs']>;
  clientData: ComponentClientDataById<Args['id'], Args['baseArgs']>;
  resolvedData: ComponentResolvedDataById<Args['id'], Args['baseArgs']>;
  storageData: {
    base: ComponentStorageDataById<Args['id'], Args['baseArgs']>;
  };
};

declare module '@game-cms/core' {
  interface ComponentTypeMap<_Args> {
    'game::spritesheet-wrapper': ComponentEntry<
      SpritesheetEntry<ResolveSpritesheetArgs<_Args>>
    >;
  }
}
