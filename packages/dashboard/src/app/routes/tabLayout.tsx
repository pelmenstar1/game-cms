import { NavTabs, HomeIcon, AppsIcon, SettingsIcon } from '@game-cms/ui';
import { Outlet } from 'react-router';

export default function Layout() {
  return (
    <div>
      <NavTabs
        items={[
          { href: '/', icon: <HomeIcon />, text: 'Home' },
          { href: '/entities', icon: <AppsIcon />, text: 'Entities' },
          { href: '/settings', icon: <SettingsIcon />, text: 'Settings' },
        ]}
      />
      <Outlet />
    </div>
  );
}
