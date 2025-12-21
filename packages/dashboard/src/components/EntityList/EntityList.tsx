import type { ClientEntitySchema } from '@game-cms/base-types';
import { listEntities } from '@game-cms/client';
import { classNames, List } from '@game-cms/ui';

import { useApiQuery } from '@/hooks/useApiQuery';
import { usePagingOptions } from '@/hooks/usePagingOptions';
import { useQueryPage } from '@/hooks/useQueryPage';

import { DataLoader } from '../DataLoader';
import { EntityListItem } from '../EntityListItem';
import { PageView } from '../PageView';
import styles from './EntityList.module.scss';

export interface EntityListProps {
  className?: string;
  schema: ClientEntitySchema;
}

const PAGE_SIZE = 10;

export function EntityList({ className, schema }: EntityListProps) {
  const [page] = useQueryPage();
  const options = usePagingOptions(page, PAGE_SIZE);
  const [itemsResult] = useApiQuery(listEntities, [schema.id, options]);

  return (
    <DataLoader
      result={itemsResult}
      className={classNames(styles.root, className)}
    >
      {({ items, meta }) => (
        <PageView
          page={page}
          pageSize={PAGE_SIZE}
          totalItems={meta.totalCount}
          className={styles['page-view']}
          getLink={(page) => `/entities/${schema.id}?page=${page}`}
        >
          <List className={styles['list']}>
            {items.map((item) => (
              <EntityListItem
                key={item._id}
                entityId={schema.id}
                value={item}
              />
            ))}
          </List>
        </PageView>
      )}
    </DataLoader>
  );
}
