import { listUsers } from '@game-cms/base-api/client';
import {
  DataLoader,
  LinkButton,
  List,
  PagePresenter,
  PlusIcon,
  Toolbar,
  usePagingOptions,
} from '@game-cms/ui';

import { useApiQuery } from '../../hooks/useApiQuery.js';
import { useCheckPermissions } from '../../hooks/useCheckPermissions.js';
import { useQueryPage } from '../../hooks/useQueryPage.js';
import { useSelfSession } from '../../hooks/useSelfSession.js';
import { UserItem } from '../../micro/UserItem/index.js';
import styles from './route.module.scss';

const PAGE_SIZE = 10;

export default function Page() {
  const page = useQueryPage();
  const pagingOptions = usePagingOptions(page, PAGE_SIZE);
  const { permissions } = useSelfSession();
  const [listResult] = useApiQuery(listUsers, [pagingOptions]);

  useCheckPermissions('user$get');

  return (
    <div className={styles.root}>
      <Toolbar>
        {permissions.has('user$create') && (
          <LinkButton
            to="/settings/users/+"
            className={styles['new-user-button']}
            buttonVariant="outlined"
            hasIcon
          >
            <PlusIcon />
            Create user
          </LinkButton>
        )}
      </Toolbar>

      <DataLoader result={listResult} className={styles['page-view-loader']}>
        {({ items, meta }) => (
          <PagePresenter
            page={page}
            pageSize={PAGE_SIZE}
            totalItems={meta.totalCount}
            className={styles['page-view']}
            getLink={(page) => `/settings/users?page=${page}`}
          >
            <List className={styles['page-view-list']}>
              {items.map((tokenInfo) => (
                <UserItem key={tokenInfo.id} info={tokenInfo} />
              ))}
            </List>
          </PagePresenter>
        )}
      </DataLoader>
    </div>
  );
}
