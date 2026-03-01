import {
  EntityId,
  EntityInternalOutDataById,
  EntitySchemaById,
} from '@game-cms/base-core';
import { List } from '@game-cms/ui';

import { Header } from '../EntityList/Header/index.js';
import { SelectableItem } from './SelectableItem/index.js';

export type SelectableEntityListProps<Id extends EntityId> = {
  className?: string;
  items: EntityInternalOutDataById<Id, string>[];
  schema: EntitySchemaById<Id>;

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
  return (
    <List className={className}>
      <Header schema={schema} />

      {items.map((item) => (
        <SelectableItem
          key={item.id}
          value={item}
          schema={schema}
          isSelected={item.id === selectedItemId}
          onSelected={() => {
            onItemSelected?.(item.id);
          }}
        />
      ))}
    </List>
  );
}
