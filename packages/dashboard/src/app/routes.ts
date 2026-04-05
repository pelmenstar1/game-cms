import { env, isEnvInitialized } from '@game-cms/global';
import { resolveAsyncMaybeFactory } from '@game-cms/shared';
import { filterOutNullable } from '@game-cms/shared/collections';
import { index, layout, route, RouteConfig } from '@react-router/dev/routes';

async function resolveCustomRoutes() {
  const { config } = env();

  const result = await Promise.all(
    config.plugins.map(async (plugin) => {
      const routes = plugin.config?.dashboard?.routes;

      if (routes) {
        return resolveAsyncMaybeFactory(routes, config);
      }
    })
  );

  return filterOutNullable(result.flat());
}

const customRoutes = isEnvInitialized() ? await resolveCustomRoutes() : [];

const baseConfig: RouteConfig = [
  route('signin', 'routes/signin/route.tsx'),
  layout('routes/tabLayout.tsx', [
    index('routes/home/route.tsx'),
    layout(
      'routes/settings/layout.tsx',
      customRoutes.filter((route) => route.layout === 'settings')
    ),
    ...customRoutes.filter((route) => route.layout !== 'settings'),
  ]),
  route('*', 'routes/notFound/route.tsx'),
];

export default baseConfig;
