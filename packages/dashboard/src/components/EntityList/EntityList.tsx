import type {
  EntityId,
  EntityRawDataById,
  EntitySchemaById,
} from '@game-cms/base-core';
import { List } from '@game-cms/ui';

import styles from './EntityList.module.scss';
import { Header } from './Header';
import { Item } from './Item';

export interface EntityListProps<Id extends EntityId> {
  className?: string;
  entityId: Id;
  items: (EntityRawDataById<Id> & { _id: string })[];
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
