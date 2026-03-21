import { MaybePromise } from '@game-cms/shared';

import { ComponentStorageDataById } from './storage.js';
import {
  ComponentId,
  ComponentOptionsById,
  ComponentPartialInDataById,
} from './types.js';

export interface ForeignComponentDataMergeContext {
  isMergeHandlerImplemented: (id: ComponentId) => boolean;

  merge: <Id extends ComponentId, Args>(
    id: Id,
    target: ComponentStorageDataById<Id, Args>,
    source: ComponentPartialInDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>
  ) => MaybePromise<ComponentStorageDataById<Id, Args>>;
}

export type ComponentDataMergeHandler<Id extends ComponentId> = <Args>(
  target: ComponentStorageDataById<Id, Args>,
  source: ComponentPartialInDataById<Id, Args>,
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentDataMergeContext
) => MaybePromise<ComponentStorageDataById<Id, Args>>;
