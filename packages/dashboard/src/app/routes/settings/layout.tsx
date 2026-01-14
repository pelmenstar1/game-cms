import { NavTabs } from '@game-cms/ui';
import { useMemo } from 'react';
import { Outlet } from 'react-router';

import { useSelfPermissions } from '@/hooks/useSelfPermissions';

import { items } from './items';
import styles from './layout.module.scss';

export default function Layout() {
  const { permissions } = useSelfPermissions();

  const allowedItems = useMemo(
    () => items.filter((item) => permissions.has(item.permission)),
    [permissions]
  );

  return (
    <div className={styles.root}>
      <NavTabs className={styles['nav-tabs']} items={allowedItems} />

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
