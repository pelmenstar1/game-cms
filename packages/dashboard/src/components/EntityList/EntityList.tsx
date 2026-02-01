import type { EntityId } from '@game-cms/base-core';
import { listEntities } from '@game-cms/client';
import { useApiQuery } from '@game-cms/component-api';
import { classNames, List, MultipleDataLoader } from '@game-cms/ui';

import { useEntitySchema } from '@/hooks/useEntitySchema';
import { usePagingOptions } from '@/hooks/usePagingOptions';
import { useQueryPage } from '@/hooks/useQueryPage';

import { PageView } from '../PageView';
import styles from './EntityList.module.scss';
import { Header } from './Header';
import { Item } from './Item';

export interface EntityListProps {
  className?: string;
  entityId: EntityId;
}

const PAGE_SIZE = 10;

export function EntityList({ className, entityId }: EntityListProps) {
  const page = useQueryPage();
  const options = usePagingOptions(page, PAGE_SIZE);
  const [itemsResult] = useApiQuery(listEntities, [entityId, options]);

  const entitySchemaResult = useEntitySchema(entityId);

  return (
    <MultipleDataLoader
      result={[itemsResult, entitySchemaResult] as const}
      className={classNames(styles.root, className)}
    >
      {([{ items, meta }, schema]) => (
        <PageView
          page={page}
          pageSize={PAGE_SIZE}
          totalItems={meta.totalCount}
          className={styles['page-view']}
          getLink={(page) => `/entities/${entityId}?page=${page}`}
        >
          <List className={styles['list']}>
            <Header schema={schema} />

            {items.map((item) => (
              <Item
                key={item._id}
                entityId={entityId}
                value={item}
                schema={schema}
              />
            ))}
          </List>
        </PageView>
      )}
    </MultipleDataLoader>
  );
}
