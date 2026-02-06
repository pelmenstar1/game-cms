import { listEntities } from '@game-cms/base-api/client';
import { EntityId } from '@game-cms/base-core';
import { useApiQuery } from '@game-cms/component-api';
import { MultipleDataLoader } from '@game-cms/ui';
import { classNames } from 'node_modules/@game-cms/ui/src/utils/classNames';

import { useEntitySchema } from '@/hooks/useEntitySchema';
import { usePagingOptions } from '@/hooks/usePagingOptions';
import { useQueryPage } from '@/hooks/useQueryPage';

import { EntityList } from '../EntityList/EntityList';
import { PageView } from '../PageView';
import styles from './EntityListLoader.module.scss';

export interface EntityListLoaderProps {
  className?: string;
  entityId: EntityId;
}

const PAGE_SIZE = 10;

export function EntityListLoader({
  className,
  entityId,
}: EntityListLoaderProps) {
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
          className={classNames(styles['page-view'], className)}
          getLink={(page) => `/entities/${entityId}?page=${page}`}
        >
          <EntityList items={items} entityId={entityId} schema={schema} />
        </PageView>
      )}
    </MultipleDataLoader>
  );
}
