import { listUsers } from '@game-cms/client';
import { useApiQuery } from '@game-cms/component-api';
import { DataLoader, LinkButton, List, PlusIcon, Toolbar } from '@game-cms/ui';

import { PageView } from '@/components/PageView';
import { UserItem } from '@/components/UserItem';
import { useCheckPermissions } from '@/hooks/useCheckPermissions';
import { usePagingOptions } from '@/hooks/usePagingOptions';
import { useQueryPage } from '@/hooks/useQueryPage';
import { useSelfPermissions } from '@/hooks/useSelfPermissions';

import styles from './route.module.scss';

const PAGE_SIZE = 10;

export default function Page() {
  const page = useQueryPage();
  const pagingOptions = usePagingOptions(page, PAGE_SIZE);
  const { permissions } = useSelfPermissions();
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
          <PageView
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
          </PageView>
        )}
      </DataLoader>
    </div>
  );
}
