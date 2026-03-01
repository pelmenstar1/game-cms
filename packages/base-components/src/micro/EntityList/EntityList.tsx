import type {
  EntityId,
  EntityOutDataById,
  EntitySchemaById,
} from '@game-cms/base-core';
import { List } from '@game-cms/ui';

import styles from './EntityList.module.scss';
import { Header } from './Header/index.js';
import { Item } from './Item/index.js';

export interface EntityListProps<Id extends EntityId> {
  className?: string;
  entityId: Id;
  items: (EntityOutDataById<Id> & { _id: string })[];
  schema: EntitySchemaById<Id>;
}

export function EntityList<Id extends EntityId>({
  entityId,
  items,
  schema,
}: EntityListProps<Id>) {
  return (
    <List className={styles['list']}>
      <Header schema={schema} />

      {items.map((item) => (
        <Item key={item._id} entityId={entityId} value={item} schema={schema} />
      ))}
    </List>
  );
}
