import { EntityId, EntityOutDataById } from '@game-cms/base-core';

export type EntityListItemInfo<Id extends EntityId> = {
  id: string;
  components: EntityOutDataById<Id>;
};
