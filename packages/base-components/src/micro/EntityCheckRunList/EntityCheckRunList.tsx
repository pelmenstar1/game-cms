import { ClientConciseEntityCheckRunWithId } from '@game-cms/base-core';
import { List } from '@game-cms/ui';

import { Header } from './Header/index.js';
import { Item } from './Item/index.js';

export interface EntityCheckRunListProps {
  className?: string;
  items: ClientConciseEntityCheckRunWithId[];
}

export function EntityCheckRunList({
  className,
  items,
}: EntityCheckRunListProps) {
  return (
    <List className={className}>
      <Header />

      {items.map((item) => (
        <Item key={item.id} value={item} />
      ))}
    </List>
  );
}
