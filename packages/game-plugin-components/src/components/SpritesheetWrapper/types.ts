import type {
  ComponentClientDataById,
  ComponentEntry,
  ComponentErrorById,
  ComponentId,
  ComponentInDataById,
  ComponentInDataByIdPathExtends,
  ComponentNestedPathDetails,
  ComponentNestedPathShape,
  ComponentOptionsById,
  ComponentOutDataById,
  ComponentPartialInDataById,
  ComponentResolvedDataById,
  ComponentSearchIndexDataById,
  ComponentStorageDataById,
} from '@game-cms/core';
import { IfExtends } from '@game-cms/shared';
import type { ObjectId } from 'mongodb';

export type SpritesheetArgs<
  Id extends ComponentId = ComponentId,
  Args = unknown,
> = {
  id: Id;
  baseArgs: Args;
};

export type ResolveSpritesheetArgs<Args> = IfExtends<Args, SpritesheetArgs>;

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
  outData: {
    base: ComponentOutDataById<Args['id'], Args['baseArgs']>;
    spritesheets?: Record<string, SpritesheetUrlEntry>;
  };
  inData: ComponentInDataById<Args['id'], Args['baseArgs']>;
  partialInData: ComponentPartialInDataById<Args['id'], Args['baseArgs']>;
  options: {
    componentId: Args['id'];
    namePath: ComponentInDataByIdPathExtends<
      string,
      Args['id'],
      Args['baseArgs']
    >;
    bundlePath: ComponentInDataByIdPathExtends<
      string,
      Args['id'],
      Args['baseArgs']
    >;
    imagePath: ComponentInDataByIdPathExtends<
      ComponentInDataById<'base::file'>,
      Args['id'],
      Args['baseArgs']
    >;
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
  searchIndexData: ComponentSearchIndexDataById<Args['id'], Args['baseArgs']>;
};

type BaseNestedPath<
  T,
  Args extends SpritesheetArgs,
> = ComponentNestedPathDetails<T, Args['id'], Args['baseArgs']>;

type BaseNestedPathShape<Args extends SpritesheetArgs> =
  ComponentNestedPathShape<Args['id'], Args['baseArgs']>;

declare module '@game-cms/core' {
  interface ComponentTypeMap<_Args> {
    'game::spritesheet-wrapper': ComponentEntry<
      SpritesheetEntry<ResolveSpritesheetArgs<_Args>>
    >;
  }

  interface ComponentNestedPathMap<T, Args> {
    'game::spritesheet-wrapper': BaseNestedPath<
      T,
      ResolveSpritesheetArgs<Args>
    >;
  }

  interface ComponentNestedPathShapeMap<Args> {
    'game::spritesheet-wrapper': BaseNestedPathShape<
      ResolveSpritesheetArgs<Args>
    >;
  }
}
