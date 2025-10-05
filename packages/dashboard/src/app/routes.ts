import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

export default [
  layout('routes/tabLayout.tsx', [
    index('routes/home/route.tsx'),
    route('entities', 'routes/entities/route.tsx'),
    route('settings', 'routes/settings/route.tsx'),
  ]),
] satisfies RouteConfig;
