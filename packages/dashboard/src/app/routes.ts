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
        route('public-routes', 'routes/settings/public-routes/route.tsx'),
        ...prefix('api-tokens', [
          index('routes/settings/api-tokens/route.tsx'),
          route('+', 'routes/settings/api-tokens/+/route.tsx'),
          route(':id', 'routes/settings/api-tokens/[id]/route.tsx'),
        ]),
        ...prefix('users', [
          index('routes/settings/users/route.tsx'),
          route('+', 'routes/settings/users/+/route.tsx'),
          route(':id', 'routes/settings/users/[id]/route.tsx'),
        ]),
      ]),
    ]),
  ]),
  route('*', 'routes/notFound/route.tsx'),
] satisfies RouteConfig;
