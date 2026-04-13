import path from 'node:path';

import {
  CustomDashboardRoute,
  CustomDashboardRouteLayout,
} from '@game-cms/base-core';

const settingsRoute = (file: string, routePath: string): CustomDashboardRoute =>
  route(`settings/${file}`, `settings/${routePath}`, 'settings');

const route = (
  file: string,
  routePath: string,
  layout?: CustomDashboardRouteLayout
): CustomDashboardRoute => ({
  layout,
  path: routePath,
  file: path.join(import.meta.dirname, file),
});

export const routes: CustomDashboardRoute[] = [
  route('entities/route.js', 'entities/:name?'),
  route('entities/+/route.js', 'entities/:name/+'),
  route('entities/edit/route.js', 'entities/:name/edit/:id'),
  route('files/route.js', 'files'),
  route('settings/route.js', 'settings'),

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

  // Entity checks
  settingsRoute('entity-check/runs/route.js', 'entity-check/runs'),
];
