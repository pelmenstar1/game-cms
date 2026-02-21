import {
  EntityId,
  EntityRawDataById,
  EntitySchemaById,
} from '@game-cms/base-core';
import { List } from '@game-cms/ui';

import { Header } from '../EntityList/Header/index.js';
import { SelectableItem } from './SelectableItem/index.js';

export type SelectableEntityListProps<Id extends EntityId> = {
  className?: string;
  items: (EntityRawDataById<Id> & { _id: string })[];
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
          key={item._id}
          value={item}
          schema={schema}
          isSelected={item._id === selectedItemId}
          onSelected={() => {
            onItemSelected?.(item._id);
          }}
        />
      ))}
    </List>
  );
}
