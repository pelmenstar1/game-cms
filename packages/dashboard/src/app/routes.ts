import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
} from '@react-router/dev/routes';

export default [
  route('signin', 'routes/signin/route.tsx'),
  layout('routes/tabLayout.tsx', [
    index('routes/home/route.tsx'),
    route('entities/:name?', 'routes/entities/route.tsx'),
    route('entities/:name/+', 'routes/entities/+/route.tsx'),
    route('entities/:name/edit/:id', 'routes/entities/edit/route.tsx'),
    route('files', 'routes/files/route.tsx'),
    layout('routes/settings/layout.tsx', [
      ...prefix('/settings', [
        index('routes/settings/route.tsx'),
        route('api-tokens', 'routes/settings/api-tokens/route.tsx'),
        route('users', 'routes/settings/users/route.tsx'),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
