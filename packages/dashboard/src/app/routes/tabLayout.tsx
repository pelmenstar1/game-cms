import { AppsIcon, HomeIcon, NavTabs, SettingsIcon } from '@game-cms/ui';
import { Outlet } from 'react-router';

import styles from './tabLayout.module.scss';

export default function Layout() {
  return (
    <div className={styles.root}>
      <NavTabs
        items={[
          { href: '/', icon: <HomeIcon />, text: 'Home 1' },
          { href: '/entities', icon: <AppsIcon />, text: 'Entities' },
          { href: '/settings', icon: <SettingsIcon />, text: 'Settings' },
        ]}
      />
      <Outlet />
    </div>
  );
}
