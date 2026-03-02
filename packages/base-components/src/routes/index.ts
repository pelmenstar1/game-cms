import path from 'node:path';

import { CustomDashboardRoute } from '@game-cms/base-core';

const settingsRoute = (
  file: string,
  routePath: string
): CustomDashboardRoute => ({
  layout: 'settings',
  path: `settings/${routePath}`,
  file: path.join(import.meta.dirname, '../settings', file),
});

export const routes: CustomDashboardRoute[] = [
  // Users
  settingsRoute('users/route.js', 'users'),
  settingsRoute('users/+/route.js', 'users/+'),
  settingsRoute('users/[id]/route.js', 'users/:id'),

  // API Tokens
  settingsRoute('api-tokens/route.js', 'api-tokens'),
  settingsRoute('api-tokens/+/route.js', 'api-tokens/+'),
  settingsRoute('api-tokens/[id]/route.js', 'api-tokens/:id'),

  // Public routes
  settingsRoute('public-routes/route.js', 'public-routes'),
];
