import { EntityId } from '@game-cms/base-core';

import { EntityListItem } from '../EntityList/types.js';

export type HeterogeneousEntityItem<Id extends EntityId = EntityId> = {
  entityId: Id;
  document: EntityListItem<Id>;
};

export type GroupedHeterogeneousEntityItems = {
  [Id in EntityId]: EntityListItem<Id>[];
};
