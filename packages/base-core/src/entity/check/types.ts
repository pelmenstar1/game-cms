import { GetPropertyOr } from '@game-cms/shared';

export interface EntityCheckTypeMap {}

export type EntityCheckId = keyof EntityCheckTypeMap extends never
  ? string
  : keyof EntityCheckTypeMap;

export type EntityCheckTypes<Id extends EntityCheckId> = GetPropertyOr<
  EntityCheckTypeMap,
  Id,
  unknown
>;

export type EntityCheckStorageData<Id extends EntityCheckId = EntityCheckId> =
  GetPropertyOr<EntityCheckTypes<Id>, 'storageData', unknown>;

export type EntityCheckStorageDataMap = {
  [Id in EntityCheckId]: EntityCheckStorageData<Id>;
};
