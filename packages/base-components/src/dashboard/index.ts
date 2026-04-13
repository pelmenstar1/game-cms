import { PluginClientDashboardConfig } from '@game-cms/base-core';
import { AppsIcon, FilesIcon, SettingsIcon } from '@game-cms/ui';

const config: PluginClientDashboardConfig = {
  tabs: [
    { href: '/entities', icon: AppsIcon, text: 'Entities' },
    { href: '/files', icon: FilesIcon, text: 'Files' },
    { href: '/settings', icon: SettingsIcon, text: 'Settings' },
  ],
  settings: {
    tabs: [
      {
        text: 'API Tokens',
        href: '/settings/api-tokens',
        permission: 'auth/token$get',
      },
      {
        text: 'Public Routes',
        href: '/settings/public-routes',
        permission: 'auth/permissions/public$get',
      },
      {
        text: 'Users',
        href: '/settings/users',
        permission: 'user$get',
      },
      {
        text: 'Entity Check Runs',
        href: '/settings/entity-check/runs',
        permission: 'entityCheck/runs$get',
      },
    ],
  },
};

export default config;
