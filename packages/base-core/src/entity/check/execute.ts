import { MaybePromise } from '@game-cms/shared';

import { BaseEntityStorageDataById, EntityId } from '../core.js';
import { EntityCheckLogger } from './logger/index.js';
import { EntityCheckId } from './types.js';
import { EntityCheckWhenParams } from './when.js';

export interface EntityCheckExecuteParams<
  Id extends EntityCheckId,
  EId extends EntityId = EntityId,
> extends EntityCheckWhenParams<Id, EId> {
  documentData: BaseEntityStorageDataById<EId>;
  logger: EntityCheckLogger;
}

export type EntityCheckExecuteFn<Id extends EntityCheckId> = <
  EId extends EntityId,
>(
  params: EntityCheckExecuteParams<Id, EId>
) => MaybePromise<void>;
