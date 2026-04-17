import { ClientConciseEntityCheckRunWithId } from '@game-cms/base-core';
import { List } from '@game-cms/ui';

import { Header } from './Header/index.js';
import { EntityCheckItemField, Item } from './Item/index.js';

export interface EntityCheckRunListProps {
  className?: string;
  items: ClientConciseEntityCheckRunWithId[];
  fields?: EntityCheckItemField[];
}

export function EntityCheckRunList({
  className,
  items,
  fields,
}: EntityCheckRunListProps) {
  return (
    <List className={className}>
      <Header fields={fields} />

      {items.map((item) => (
        <Item key={item.id} value={item} fields={fields} />
      ))}
    </List>
  );
}
