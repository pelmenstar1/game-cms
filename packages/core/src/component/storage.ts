import { MaybePromise } from '@game-cms/shared';

import { ForeignComponentPathWalkerContext } from './pathWalker.js';
import {
  ComponentId,
  ComponentInDataById,
  ComponentOptionsById,
  ComponentOutDataById,
  GetComponentTypesById,
} from './types.js';

export type ComponentStorageDataById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['storageData'];

export type ComponentStoragePartialDataById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['partialStorageData'];

export type ComponentStorageDisposeDataParams = {
  afterUpdate: boolean;
};

export interface ForeignComponentStorageDefaultDataContext {
  getDefaultData: <Id extends ComponentId, Args>(
    id: Id,
    options: ComponentOptionsById<Id, Args>
  ) => ComponentStorageDataById<Id, Args>;
}

export interface ForeignComponentStorageDataTransformerContext
  extends
    ForeignComponentPathWalkerContext,
    ForeignComponentStorageDefaultDataContext {
  toStorage: <Id extends ComponentId, Args>(
    id: Id,
    data: ComponentInDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>
  ) => MaybePromise<ComponentStorageDataById<Id, Args>>;

  fromStorage: <Id extends ComponentId, Args>(
    id: Id,
    data: ComponentStorageDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>
  ) => MaybePromise<ComponentOutDataById<Id, Args>>;

  disposeData: <Id extends ComponentId, Args>(
    id: Id,
    data: ComponentStorageDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    params?: Partial<ComponentStorageDisposeDataParams>
  ) => MaybePromise<void>;
}

export type ComponentStorageDataTransformer<Id extends ComponentId> = {
  getDefaultData: <Args>(
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentStorageDataTransformerContext
  ) => ComponentStorageDataById<Id, Args>;

  toStorage: <Args>(
    data: ComponentInDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentStorageDataTransformerContext
  ) => MaybePromise<ComponentStorageDataById<Id, Args>>;

  fromStorage: <Args>(
    data: ComponentStorageDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentStorageDataTransformerContext
  ) => MaybePromise<ComponentOutDataById<Id, Args>>;

  disposeData?: <Args>(
    data: ComponentStorageDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentStorageDataTransformerContext,
    params: ComponentStorageDisposeDataParams
  ) => MaybePromise<void>;
};
