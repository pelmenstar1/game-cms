import type {
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
import {
  GameAssetPipeline,
  GameAssetPipelineStepOutDataMap,
  GameAssetPipelineStepStorageDataMap,
} from '@game-cms/game-plugin-core';
import { IfExtends } from '@game-cms/shared';

export type AssetWrapperArgs<
  Id extends ComponentId = ComponentId,
  Args = unknown,
> = {
  id: Id;
  baseArgs: Args;
};

export type ResolveAssetWrapperArgs<Args> = IfExtends<Args, AssetWrapperArgs>;

type AssetWrapperEntry<Args extends AssetWrapperArgs> = {
  outData: {
    base: ComponentOutDataById<Args['id'], Args['baseArgs']>;
    derived?: GameAssetPipelineStepOutDataMap;
  };
  inData: ComponentInDataById<Args['id'], Args['baseArgs']>;
  options: {
    componentId: Args['id'];
    pipeline: GameAssetPipeline;
    baseOptions: ComponentOptionsById<Args['id'], Args['baseArgs']>;
  };
  clientOptions: {
    componentId: Args['id'];
    baseOptions: ComponentClientOptionsById<Args['id'], Args['baseArgs']>;
  };
  error: ComponentErrorById<Args['id'], Args['baseArgs']>;
  clientData: {
    base: ComponentClientDataById<Args['id'], Args['baseArgs']>;
    derived?: GameAssetPipelineStepOutDataMap;
  };
  resolvedData: ComponentResolvedDataById<Args['id'], Args['baseArgs']>;
  storageData: {
    base: ComponentStorageDataById<Args['id'], Args['baseArgs']>;
    derived: GameAssetPipelineStepStorageDataMap;
  };
  searchIndexData: ComponentSearchIndexDataById<Args['id'], Args['baseArgs']>;
};

type BaseNestedPath<
  T,
  Args extends AssetWrapperArgs,
> = ComponentNestedPathDetails<T, Args['id'], Args['baseArgs']>;

type BaseNestedPathShape<Args extends AssetWrapperArgs> =
  ComponentNestedPathShape<Args['id'], Args['baseArgs']>;

declare module '@game-cms/core' {
  interface ComponentTypeMap<_Args> {
    'game::asset-wrapper': ComponentEntry<
      AssetWrapperEntry<ResolveAssetWrapperArgs<_Args>>
    >;
  }

  interface ComponentNestedPathMap<T, Args> {
    'game::asset-wrapper': BaseNestedPath<T, ResolveAssetWrapperArgs<Args>>;
  }

  interface ComponentNestedPathShapeMap<Args> {
    'game::asset-wrapper': BaseNestedPathShape<ResolveAssetWrapperArgs<Args>>;
  }
}
