import { SettingsTabMap } from '@game-cms/base-core';

export const settings: SettingsTabMap = {
  'base::api-tokens': {
    title: 'API Tokens',
    href: '/settings/api-tokens',
    permission: 'auth/token$get',
  },
  'base::public-routes': {
    title: 'Public Routes',
    href: '/settings/public-routes',
    permission: 'auth/permissions/public$get',
  },
  'base::users': {
    title: 'Users',
    href: '/settings/users',
    permission: 'user$get',
  },
};
