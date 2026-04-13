import { MaybePromise } from '@game-cms/shared';
import { ObjectId } from 'mongodb';

import { EntityDocumentMeta, EntityId } from '../core.js';
import { EntityCheckId, EntityCheckStorageData } from './types.js';

export type EntityCheckWhenParams<
  Id extends EntityCheckId,
  EId extends EntityId = EntityId,
> = {
  entityId: EId;
  documentId: ObjectId;
  documentMeta: EntityDocumentMeta;
  storageData?: EntityCheckStorageData<Id>;
};

export type EntityCheckWhenFn<Id extends EntityCheckId> = <
  EId extends EntityId,
>(
  params: EntityCheckWhenParams<Id, EId>
) => MaybePromise<boolean>;
