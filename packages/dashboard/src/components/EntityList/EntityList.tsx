import type { EntityId } from '@game-cms/base-core';
import { listEntities } from '@game-cms/client';
import { useApiQuery } from '@game-cms/component-api';
import { classNames, DataLoader, List } from '@game-cms/ui';

import { usePagingOptions } from '@/hooks/usePagingOptions';
import { useQueryPage } from '@/hooks/useQueryPage';

import { EntityListItem } from '../EntityListItem';
import { PageView } from '../PageView';
import styles from './EntityList.module.scss';

export interface EntityListProps {
  className?: string;
  entityId: EntityId;
}

const PAGE_SIZE = 10;

export function EntityList({ className, entityId }: EntityListProps) {
  const [page] = useQueryPage();
  const options = usePagingOptions(page, PAGE_SIZE);
  const [itemsResult] = useApiQuery(listEntities, [entityId, options]);

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
          getLink={(page) => `/entities/${entityId}?page=${page}`}
        >
          <List className={styles['list']}>
            {items.map((item) => (
              <EntityListItem key={item._id} entityId={entityId} value={item} />
            ))}
          </List>
        </PageView>
      )}
    </DataLoader>
  );
}
