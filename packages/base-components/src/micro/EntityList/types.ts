import { EntityId, EntityOutDataById } from '@game-cms/base-core';

export type EntityListItem<Id extends EntityId> = {
  id: string;
  components: EntityOutDataById<Id>;
};
