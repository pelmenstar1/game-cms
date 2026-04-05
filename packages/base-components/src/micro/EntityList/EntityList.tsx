import type { EntityClientSchemaById, EntityId } from '@game-cms/base-core';
import { useComponentApi } from '@game-cms/component-api';
import { List } from '@game-cms/ui';
import { useMemo } from 'react';

import { getEntityDisplayKeys } from '../../internal/entity.js';
import styles from './EntityList.module.scss';
import { Header } from './Header/index.js';
import { Item } from './Item/index.js';
import { EntityListItemInfo } from './types.js';

export interface EntityListProps<Id extends EntityId> {
  className?: string;
  entityId: Id;
  items: EntityListItemInfo<Id>[];
  schema: EntityClientSchemaById<Id>;
}

export function EntityList<Id extends EntityId>({
  entityId,
  items,
  schema,
}: EntityListProps<Id>) {
  const api = useComponentApi();
  const displayKeys = useMemo(
    () => getEntityDisplayKeys(schema, api),
    [schema, api]
  );

  return (
    <List className={styles['list']}>
      <Header displayKeys={displayKeys} />

      {items.map((item) => (
        <Item
          key={item.id}
          entityId={entityId}
          value={item}
          schema={schema}
          displayKeys={displayKeys}
        />
      ))}
    </List>
  );
}
