import { NavTabs } from '@game-cms/ui';
import { Outlet } from 'react-router';

import { items } from './items';
import styles from './layout.module.scss';

export default function Layout() {
  return (
    <div className={styles.root}>
      <NavTabs className={styles['nav-tabs']} items={items} />

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
