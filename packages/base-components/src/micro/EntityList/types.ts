import { EntityClientDataById, EntityId } from '@game-cms/base-core';

export type EntityClientDataByIdWithId<Id extends EntityId> =
  EntityClientDataById<Id> & { _id: string };
