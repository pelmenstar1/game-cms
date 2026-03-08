import type { EntityId, EntitySchemaById } from '@game-cms/base-core';
import { Link } from '@game-cms/ui';

import { BaseItem } from '../BaseItem/BaseItem.js';
import { EntityListItem } from '../types.js';

export interface ItemProps<Id extends EntityId> {
  className?: string;
  entityId: Id;
  schema: EntitySchemaById<Id>;
  value: EntityListItem<Id>;
}

export function Item<Id extends EntityId>({
  className,
  schema,
  entityId,
  value,
}: ItemProps<Id>) {
  return (
    <BaseItem
      className={className}
      wrapper={Link}
      schema={schema}
      value={value}
      to={`/entities/${entityId}/edit/${value.id}`}
    />
  );
}
