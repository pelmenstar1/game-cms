import { listEntities } from '@game-cms/base-api/client';
import { useApiQuery } from '@game-cms/component-api';
import {
  classNames,
  MultipleDataLoader,
  PagePresenter,
  usePagingOptions,
} from '@game-cms/ui';
import { useState } from 'react';

import { useEntitySchema } from '../../hooks/useEntitySchema.js';
import { SelectableEntityList } from '../SelectableEntityList/index.js';
import styles from './SelectableEntityListLoader.module.scss';

export interface SelectableEntityListLoaderProps {
  className?: string;
  entityId: string;
  selectedItemId?: string;
  onItemSelected?: (id: string) => void;
}

const PAGE_SIZE = 10;

export function SelectableEntityListLoader({
  className,
  entityId,
  selectedItemId,
  onItemSelected,
}: SelectableEntityListLoaderProps) {
  const [page, setPage] = useState(1);
  const options = usePagingOptions(page, PAGE_SIZE);
  const [itemsResult] = useApiQuery(listEntities, [entityId, options]);

  const entitySchemaResult = useEntitySchema(entityId);

  return (
    <MultipleDataLoader
      result={[itemsResult, entitySchemaResult] as const}
      className={classNames(styles.root, className)}
    >
      {([{ items, meta }, schema]) => (
        <PagePresenter
          page={page}
          pageSize={PAGE_SIZE}
          totalItems={meta.totalCount}
          className={classNames(styles['page-presenter'], className)}
          onButtonClick={setPage}
        >
          <SelectableEntityList
            items={items}
            schema={schema}
            selectedItemId={selectedItemId}
            onItemSelected={onItemSelected}
            className={styles['entity-list']}
          />
        </PagePresenter>
      )}
    </MultipleDataLoader>
  );
}
