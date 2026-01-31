import type { NavTabInfoWithPermission } from '@/types/tabs';

export const items: NavTabInfoWithPermission[] = [
  {
    text: 'API Tokens',
    href: '/settings/api-tokens',
    permission: 'auth/token$get',
  },
  { text: 'Users', href: '/settings/users', permission: 'user$get' },
  {
    text: 'Public routes',
    href: '/settings/public-routes',
    permission: 'auth/permissions/public$get',
  },
  {
    text: 'Reviewers',
    href: '/settings/review',
    permission: 'entityCheck/base::review/reviewers$get',
  },
];
