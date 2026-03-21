import {
  ComponentId,
  ComponentInDataById,
  ComponentOptionsById,
  ForeignComponentStorageDataResolverContext,
} from '@game-cms/core';
import { GetPropertyOr, MaybePromise } from '@game-cms/shared';

export interface GameAssetPipelineStepTypeRegistry {
  // Expected shape:
  // [Id of the pipeline step]: { client: unknown; out: unknown; storage: unknown; }
}

type GetStepType<Id extends string, K extends string> = GetPropertyOr<
  GetPropertyOr<GameAssetPipelineStepTypeRegistry, Id, unknown>,
  K,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>;

type BaseStepTypeMap<K extends string> = {
  [Id in keyof GameAssetPipelineStepTypeRegistry]?: GetStepType<Id, K>;
};

export type GameAssetPipelineStepClientData<Id extends string> = GetStepType<
  Id,
  'client'
>;

export type GameAssetPipelineStepOutData<Id extends string> = GetStepType<
  Id,
  'out'
>;

export type GameAssetPipelineStepStorageData<Id extends string> = GetStepType<
  Id,
  'storage'
>;

export type GameAssetPipelineStepClientDataMap = BaseStepTypeMap<'client'>;
export type GameAssetPipelineStepOutDataMap = BaseStepTypeMap<'out'>;
export type GameAssetPipelineStepStorageDataMap = BaseStepTypeMap<'storage'>;

export type GameAssetPipelineStepDataOptions<Id extends ComponentId, Args> = {
  componentId: Id;
  baseOptions: ComponentOptionsById<Id, Args>;
};

export type GameAssetPipelineStep<Id extends string = string> = {
  id: Id;

  fromStorage: (
    storageData: GameAssetPipelineStepStorageData<Id>,
    context: ForeignComponentStorageDataResolverContext
  ) => Promise<GameAssetPipelineStepOutData<Id>>;

  apply: <CId extends ComponentId, Args>(
    inData: ComponentInDataById<CId, Args>,
    options: GameAssetPipelineStepDataOptions<CId, Args>,
    context: ForeignComponentStorageDataResolverContext
  ) => Promise<GameAssetPipelineStepStorageData<Id>>;

  disposeStorage?: (
    storageData: GameAssetPipelineStepStorageData<Id>
  ) => MaybePromise<void>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyGameAssetPipelineStep = GameAssetPipelineStep<any>;

export type GameAssetPipeline = AnyGameAssetPipelineStep[];

export function defineGameAssetPipelineStep<Id extends string>(
  step: GameAssetPipelineStep<Id>
) {
  return step;
}
