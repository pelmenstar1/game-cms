import { AppsIcon, HomeIcon, NavTabs, SettingsIcon } from '@game-cms/ui';
import { Outlet } from 'react-router';

import styles from './tabLayout.module.scss';

export default function Layout() {
  return (
    <div className={styles.root}>
      <NavTabs
        className={styles['nav-tabs']}
        items={[
          { href: '/', icon: <HomeIcon />, text: 'Home' },
          { href: '/entities', icon: <AppsIcon />, text: 'Entities' },
          { href: '/files', icon: <AppsIcon />, text: 'Files' },
          { href: '/settings', icon: <SettingsIcon />, text: 'Settings' },
        ]}
      />

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
