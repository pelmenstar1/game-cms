import { listEntities } from '@game-cms/client';
import type { ClientEntitySchema } from '@game-cms/types';
import { classNames, List } from '@game-cms/ui';

import { useApiQuery } from '@/hooks/useApiQuery';

import { DataLoader } from '../DataLoader';
import { EntityListItem } from '../EntityListItem';
import styles from './EntityList.module.scss';

export interface EntityListProps {
  className?: string;
  schema: ClientEntitySchema;
}

export function EntityList({ className, schema }: EntityListProps) {
  const [itemsResult] = useApiQuery(listEntities, [schema.id]);

  return (
    <DataLoader
      result={itemsResult}
      className={classNames(styles.root, className)}
    >
      {({ items }) => (
        <List>
          {items.map((item) => (
            <EntityListItem key={item._id} value={item} />
          ))}
        </List>
      )}
    </DataLoader>
  );
}
