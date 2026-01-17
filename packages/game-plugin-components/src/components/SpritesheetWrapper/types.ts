import type {
  ComponentClientDataById,
  ComponentEntry,
  ComponentErrorById,
  ComponentId,
  ComponentOptionsById,
  ComponentRawDataById,
  ComponentRawInDataById,
  ComponentRawInDataByIdPath,
  ComponentResolvedDataById,
  ComponentStorageDataById,
} from '@game-cms/core';
import type { ObjectId } from 'mongodb';

export type SpritesheetArgs<
  Id extends ComponentId = ComponentId,
  Args = unknown,
> = {
  id: Id;
  baseArgs: Args;
};

export type ResolveSpritesheetArgs<Args> =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Args extends SpritesheetArgs<infer _Id extends ComponentId, infer _BaseArgs>
    ? Args
    : SpritesheetArgs;

export type SpritesheetStorageEntry = {
  imageId: ObjectId;
  atlasId: ObjectId;
};

export type SpritesheetBundleStorageMap = Record<
  string,
  SpritesheetStorageEntry
>;

export type SpritesheetUrlEntry = {
  imageUrl: string;
  atlasUrl: string;
};

type SpritesheetEntry<Args extends SpritesheetArgs> = {
  rawData: {
    base: ComponentRawDataById<Args['id'], Args['baseArgs']>;
    spritesheets?: Record<string, SpritesheetUrlEntry>;
  };
  rawInData: ComponentRawInDataById<Args['id'], Args['baseArgs']>;
  options: {
    componentId: Args['id'];
    namePath: ComponentRawInDataByIdPath<Args['id'], Args['baseArgs']>;
    bundlePath: ComponentRawInDataByIdPath<Args['id'], Args['baseArgs']>;
    imagePath: ComponentRawInDataByIdPath<Args['id'], Args['baseArgs']>;
    baseOptions: ComponentOptionsById<Args['id'], Args['baseArgs']>;
  };
  error: ComponentErrorById<Args['id'], Args['baseArgs']>;
  clientData: {
    base: ComponentClientDataById<Args['id'], Args['baseArgs']>;
    spritesheets?: Record<string, SpritesheetUrlEntry>;
  };
  resolvedData: ComponentResolvedDataById<Args['id'], Args['baseArgs']>;
  storageData: {
    base: ComponentStorageDataById<Args['id'], Args['baseArgs']>;
    spritesheets: SpritesheetBundleStorageMap;
  };
};

declare module '@game-cms/core' {
  interface ComponentTypeMap<_Args> {
    'game::spritesheet-wrapper': ComponentEntry<
      SpritesheetEntry<ResolveSpritesheetArgs<_Args>>
    >;
  }
}
