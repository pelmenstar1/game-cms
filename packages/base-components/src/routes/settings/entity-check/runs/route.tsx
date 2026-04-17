import { listEntityCheckRuns } from '@game-cms/base-api/client';
import { DataLoader, PagePresenter, usePagingOptions } from '@game-cms/ui';

import { useApiQuery } from '../../../../hooks/useApiQuery.js';
import { useQueryPage } from '../../../../hooks/useQueryPage.js';
import { EntityCheckRunList } from '../../../../micro/EntityCheck/EntityCheckRunList/index.js';
import styles from './route.module.scss';

const PAGE_SIZE = 20;

export default function Page() {
  const page = useQueryPage();
  const pagingOptions = usePagingOptions(page, PAGE_SIZE);

  const [listResult] = useApiQuery(listEntityCheckRuns, [pagingOptions]);

  return (
    <div className={styles['root']}>
      <DataLoader result={listResult} className={styles['loader']}>
        {({ items, meta }) => (
          <PagePresenter
            page={page}
            pageSize={PAGE_SIZE}
            totalItems={meta.totalCount}
            className={styles['page-view']}
            getLink={(p) => `/settings/entity-check/runs?page=${p}`}
          >
            <EntityCheckRunList items={items} className={styles['list']} />
          </PagePresenter>
        )}
      </DataLoader>
    </div>
  );
}
