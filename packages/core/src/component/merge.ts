import { MaybePromise } from '@game-cms/shared';

import { ComponentStorageDataById } from './storage.js';
import {
  ComponentId,
  ComponentOptionsById,
  ComponentRawInPartialDataById,
} from './types.js';

export interface ForeignComponentDataMergeContext {
  merge: <Id extends ComponentId, Args>(
    id: Id,
    target: ComponentStorageDataById<Id, Args>,
    source: ComponentRawInPartialDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>
  ) => MaybePromise<ComponentStorageDataById<Id, Args>>;
}

export type ComponentDataMergeHandler<Id extends ComponentId> = <Args>(
  target: ComponentStorageDataById<Id, Args>,
  source: ComponentRawInPartialDataById<Id, Args>,
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentDataMergeContext
) => MaybePromise<ComponentStorageDataById<Id, Args>>;
