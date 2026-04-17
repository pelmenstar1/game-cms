import { EntityId } from '@game-cms/base-core';

import { EntityListItemInfo } from '../EntityList/types.js';

export type HeterogeneousEntityItem<Id extends EntityId = EntityId> = {
  entityId: Id;
  document: EntityListItemInfo<Id>;
};

export type GroupedHeterogeneousEntityItems = {
  [Id in EntityId]: EntityListItemInfo<Id>[];
};
