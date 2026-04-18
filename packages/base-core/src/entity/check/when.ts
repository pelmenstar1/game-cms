import { MaybePromise } from '@game-cms/shared';
import { ObjectId } from 'mongodb';

import { EntityDocumentMeta, EntityId, EntityVariant } from '../core.js';
import { EntityCheckId, EntityCheckStorageData } from './types.js';

export type EntityCheckWhenParams<
  Id extends EntityCheckId,
  EId extends EntityId = EntityId,
> = {
  entityId: EId;

  // Document id might be undefined if the entity is being created and the check is being run before the document is actually created.
  documentId?: ObjectId;
  documentMeta: EntityDocumentMeta;
  documentVariant: EntityVariant;

  // The storage data might be undefined if the check is being run for a document that doesn't have any data yet (e.g. during creation).
  storageData?: EntityCheckStorageData<Id>;
};

export type EntityCheckWhenFn<Id extends EntityCheckId> = <
  EId extends EntityId,
>(
  params: EntityCheckWhenParams<Id, EId>
) => MaybePromise<boolean>;
