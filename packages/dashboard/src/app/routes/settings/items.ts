import type { NavTabInfoWithPermission } from '@/types/tabs';

export const items: NavTabInfoWithPermission[] = [
  {
    text: 'API Tokens',
    href: '/settings/api-tokens',
    permission: 'auth/token$get',
  },
  { text: 'Users', href: '/settings/users', permission: 'user$get' },
];
