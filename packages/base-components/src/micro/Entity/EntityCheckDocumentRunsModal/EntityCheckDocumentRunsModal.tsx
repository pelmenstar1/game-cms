import { listEntityCheckRuns } from '@game-cms/base-api/client';
import { EntityId } from '@game-cms/base-core';
import {
  DataLoader,
  ModalDialog,
  ModalProps,
  PagePresenter,
  usePagingOptions,
} from '@game-cms/ui';
import { useMemo, useState } from 'react';

import { useApiQuery } from '../../../hooks/useApiQuery.js';
import { EntityCheckRunList } from '../../EntityCheck/EntityCheckRunList/index.js';
import styles from './EntityCheckDocumentRunsModal.module.scss';

export interface EntityCheckDocumentRunsModalProps extends ModalProps {
  entityId: EntityId;
  documentId: string;
}

const PAGE_SIZE = 10;

export function EntityCheckDocumentRunsModal({
  entityId,
  documentId,
  onClose,
}: EntityCheckDocumentRunsModalProps) {
  const [page, setPage] = useState(1);
  const pagingOptions = usePagingOptions(page, PAGE_SIZE);

  const options = useMemo(
    () => ({ entityId, documentId, ...pagingOptions }),
    [entityId, documentId, pagingOptions]
  );

  const [result] = useApiQuery(listEntityCheckRuns, [options]);

  return (
    <ModalDialog title="Check runs" onClose={onClose} fastExit>
      <DataLoader result={result}>
        {({ items, meta }) => (
          <PagePresenter
            page={page}
            pageSize={PAGE_SIZE}
            totalItems={meta.totalCount}
            onButtonClick={setPage}
          >
            <EntityCheckRunList className={styles['list']} items={items} />
          </PagePresenter>
        )}
      </DataLoader>
    </ModalDialog>
  );
}
