import {
  EntityDataByIdWithId,
  searchEntities,
} from '@game-cms/base-api/client';
import { EntityId } from '@game-cms/base-core';
import { useApiQuery } from '@game-cms/component-api';
import { emptyPageData } from '@game-cms/shared';
import {
  ModalDialog,
  ModalProps,
  MultipleDataLoader,
  TextInput,
} from '@game-cms/ui';
import { useState } from 'react';

import { useEntitySchema } from '@/hooks/useEntitySchema';
import { usePagingOptions } from '@/hooks/usePagingOptions';

import { EntityList } from '../EntityList';
import { PageView } from '../PageView';
import styles from './EntitySearchDialog.module.scss';

export interface EntitySearchDialogProps extends ModalProps {
  entityId: EntityId;
}

const PAGE_SIZE = 10;

export function EntitySearchDialog({
  onClose,
  entityId,
}: EntitySearchDialogProps) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const pagingOptions = usePagingOptions(page, PAGE_SIZE);
  const [itemsResult] = useApiQuery(
    searchEntities,
    [entityId, query, pagingOptions],
    {
      isEnabled: query.length > 0,
      disabledData: emptyPageData<EntityDataByIdWithId<string>>(),
    }
  );

  const schemaResult = useEntitySchema(entityId);

  return (
    <ModalDialog
      title="Search"
      onClose={onClose}
      contentClassName={styles.content}
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
          <PageView
            page={page}
            pageSize={PAGE_SIZE}
            totalItems={meta.totalCount}
            onButtonClick={setPage}
            className={styles['page-view']}
          >
            <EntityList entityId={entityId} items={items} schema={schema} />
          </PageView>
        )}
      </MultipleDataLoader>
    </ModalDialog>
  );
}
