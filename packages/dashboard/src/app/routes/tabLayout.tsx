import {
  AppsIcon,
  FilesIcon,
  HomeIcon,
  type NavTabInfo,
  NavTabs,
  SettingsIcon,
} from '@game-cms/ui';
import { Outlet } from 'react-router';

import styles from './tabLayout.module.scss';

const items: NavTabInfo[] = [
  { href: '/', icon: <HomeIcon />, text: 'Home' },
  { href: '/entities', icon: <AppsIcon />, text: 'Entities' },
  { href: '/files', icon: <FilesIcon />, text: 'Files' },
  { href: '/settings', icon: <SettingsIcon />, text: 'Settings' },
];

export default function Layout() {
  return (
    <div className={styles.root}>
      <NavTabs collapsable className={styles['nav-tabs']} items={items} />

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
