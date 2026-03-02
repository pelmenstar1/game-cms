import path from 'node:path';

import { CustomDashboardRoute } from '@game-cms/base-core';

export const routes: CustomDashboardRoute[] = [
  {
    layout: 'settings',
    path: '/settings/review',
    file: path.join(import.meta.dirname, 'edit/route.js'),
  },
];
