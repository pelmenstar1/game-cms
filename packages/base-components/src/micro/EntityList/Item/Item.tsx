import {
  EntityClientSchemaById,
  EntityDisplayKeyById,
  EntityId,
} from '@game-cms/base-core';
import { Link } from '@game-cms/ui';

import { BaseItem } from '../BaseItem/BaseItem.js';
import { EntityListItemInfo } from '../types.js';

export interface ItemProps<Id extends EntityId> {
  className?: string;
  entityId: Id;
  schema: EntityClientSchemaById<Id>;
  value: EntityListItemInfo<Id>;
  displayKeys: EntityDisplayKeyById<Id>[];
}

export function Item<Id extends EntityId>({
  className,
  schema,
  entityId,
  value,
  displayKeys,
}: ItemProps<Id>) {
  return (
    <BaseItem
      className={className}
      schema={schema}
      value={value}
      displayKeys={displayKeys}
      wrapper={Link}
      wrapperProps={{
        to: `/entities/${entityId}/edit/${value.id}`,
      }}
    />
  );
}
