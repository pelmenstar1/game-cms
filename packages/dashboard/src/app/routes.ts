import {
  index,
  layout,
  route,
  type RouteConfig,
} from '@react-router/dev/routes';

export default [
  route('signin', 'routes/signin/route.tsx'),
  layout('routes/tabLayout.tsx', [
    index('routes/home/route.tsx'),
    route('entities/:name?', 'routes/entities/route.tsx'),
    route('settings', 'routes/settings/route.tsx'),
  ]),
] satisfies RouteConfig;
