import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home/route.tsx'),
  route('entities', 'routes/entities/route.tsx'),
] satisfies RouteConfig;
