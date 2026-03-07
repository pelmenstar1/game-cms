import { searchEntities } from '@game-cms/base-api/client';
import { EntityId, EntityInternalOutDataById } from '@game-cms/base-core';
import { emptyPageData } from '@game-cms/shared';
import {
  ModalDialog,
  ModalProps,
  MultipleDataLoader,
  PagePresenter,
  TextInput,
  usePagingOptions,
} from '@game-cms/ui';
import { useState } from 'react';

import { useApiQuery } from '../../hooks/useApiQuery.js';
import { useEntitySchema } from '../../hooks/useEntitySchema.js';
import { EntityList } from '../EntityList/index.js';
import styles from './EntitySearchDialog.module.scss';

export interface EntitySearchDialogProps<
  T extends EntityId,
> extends ModalProps {
  entityId: T;
}

const PAGE_SIZE = 10;

export function EntitySearchDialog<T extends EntityId>({
  onClose,
  entityId,
}: EntitySearchDialogProps<T>) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const pagingOptions = usePagingOptions(page, PAGE_SIZE);
  const [itemsResult] = useApiQuery(
    searchEntities<T>,
    [entityId, query, pagingOptions],
    {
      isEnabled: query.length > 0,
      disabledData: emptyPageData<EntityInternalOutDataById<T, string>>(),
    }
  );

  const schemaResult = useEntitySchema(entityId);

  return (
    <ModalDialog
      title="Search"
      onClose={onClose}
      contentClassName={styles.content}
      fastExit
    >
      <TextInput
        className={styles.query}
        value={query}
        onTextChanged={setQuery}
      />

      <MultipleDataLoader
        className={styles.result}
        result={[itemsResult, schemaResult] as const}
      >
        {([{ items, meta }, schema]) => (
          <PagePresenter
            page={page}
            pageSize={PAGE_SIZE}
            totalItems={meta.totalCount}
            onButtonClick={setPage}
            className={styles['page-view']}
          >
            <EntityList entityId={entityId} items={items} schema={schema} />
          </PagePresenter>
        )}
      </MultipleDataLoader>
    </ModalDialog>
  );
}
