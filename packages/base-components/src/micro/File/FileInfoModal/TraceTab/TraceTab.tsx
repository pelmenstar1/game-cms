import { traceFile } from '@game-cms/base-api/client';
import {
  classNames,
  DataLoader,
  PagePresenter,
  Typography,
  usePagingOptions,
} from '@game-cms/ui';
import { useState } from 'react';

import { useApiQuery } from '../../../../hooks/useApiQuery.js';
import { HeterogeneousEntityList } from '../../../Entity/HeterogeneousEntityList/index.js';
import styles from './TraceTab.module.scss';

export interface TraceTabProps {
  className?: string;
  fileId: string;
}

const PAGE_SIZE = 10;

export function TraceTab({ className, fileId }: TraceTabProps) {
  const [page, setPage] = useState(1);
  const options = usePagingOptions(page, PAGE_SIZE);
  const [result, refresh] = useApiQuery(traceFile, [fileId, options]);

  return (
    <DataLoader
      result={result}
      className={classNames(styles.root, className)}
      onRetry={refresh}
    >
      {({ items, meta }) =>
        items.length > 0 ? (
          <PagePresenter
            page={page}
            pageSize={PAGE_SIZE}
            totalItems={meta.totalCount}
            onButtonClick={setPage}
            className={styles['page-presenter']}
          >
            <HeterogeneousEntityList items={items} className={styles.list} />
          </PagePresenter>
        ) : (
          <Typography>No entities found</Typography>
        )
      }
    </DataLoader>
  );
}
