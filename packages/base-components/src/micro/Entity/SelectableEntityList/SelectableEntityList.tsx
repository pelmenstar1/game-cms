import {
  EntityClientSchemaById,
  EntityId,
  EntityInternalOutDataById,
} from '@game-cms/base-core';
import { useComponentApi } from '@game-cms/component-api';
import { List } from '@game-cms/ui';
import { useMemo } from 'react';

import { getEntityDisplayKeys } from '../../../internal/entity.js';
import { Header } from '../EntityList/Header/index.js';
import { SelectableItem } from './SelectableItem/index.js';

export type SelectableEntityListProps<Id extends EntityId> = {
  className?: string;
  items: EntityInternalOutDataById<Id, string>[];
  schema: EntityClientSchemaById<Id>;

  selectedItemId?: string;
  onItemSelected?: (id: string) => void;
};

export function SelectableEntityList<Id extends EntityId>({
  className,
  items,
  selectedItemId,
  onItemSelected,
  schema,
}: SelectableEntityListProps<Id>) {
  const api = useComponentApi();
  const displayKeys = useMemo(
    () => getEntityDisplayKeys(schema, api),
    [schema, api]
  );

  return (
    <List className={className}>
      <Header displayKeys={displayKeys} />

      {items.map((item) => (
        <SelectableItem
          key={item.id}
          value={item}
          schema={schema}
          isSelected={item.id === selectedItemId}
          displayKeys={displayKeys}
          onSelected={() => {
            onItemSelected?.(item.id);
          }}
        />
      ))}
    </List>
  );
}
