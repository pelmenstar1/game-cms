import { listApiTokens } from '@game-cms/base-api/client';
import {
  DataLoader,
  LinkButton,
  List,
  PagePresenter,
  PlusIcon,
  usePagingOptions,
} from '@game-cms/ui';

import { useApiQuery } from '../../../hooks/useApiQuery.js';
import { useQueryPage } from '../../../hooks/useQueryPage.js';
import { ApiTokenItem } from '../../../micro/ApiToken/ApiTokenItem/index.js';
import styles from './route.module.scss';

const PAGE_SIZE = 10;

export default function Page() {
  const page = useQueryPage();
  const pagingOptions = usePagingOptions(page, PAGE_SIZE);

  const [listResult] = useApiQuery(listApiTokens, [pagingOptions]);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <LinkButton
          to="/settings/api-tokens/+"
          className={styles['new-token-button']}
          buttonVariant="outlined"
          hasIcon
        >
          <PlusIcon />
          Create token
        </LinkButton>
      </div>

      <DataLoader result={listResult} className={styles['page-view-loader']}>
        {({ items, meta }) => (
          <PagePresenter
            page={page}
            pageSize={PAGE_SIZE}
            totalItems={meta.totalCount}
            className={styles['page-view']}
            getLink={(page) => `/settings/api-tokens?page=${page}`}
          >
            <List className={styles['page-view-list']}>
              {items.map((tokenInfo) => (
                <ApiTokenItem key={tokenInfo.id} info={tokenInfo} />
              ))}
            </List>
          </PagePresenter>
        )}
      </DataLoader>
    </div>
  );
}
