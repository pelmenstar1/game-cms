import { CustomDashboardRoute } from '@game-cms/base-core';
import { env, isEnvInitialized } from '@game-cms/global';
import { initEnvFromConfigs, readDashboardBuildMeta } from '@game-cms/ignition';
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

let customRoutes: CustomDashboardRoute[] = [];

if (!isEnvInitialized()) {
  const meta = await readDashboardBuildMeta();

  if (meta) {
    await initEnvFromConfigs(meta.basePath);

    customRoutes = await resolveCustomRoutes();
  }
}

const baseConfig: RouteConfig = [
  route('signin', 'routes/signin/route.tsx'),
  layout('routes/tabLayout.tsx', [
    index('routes/home/route.tsx'),
    route('entities/:name?', 'routes/entities/route.tsx'),
    route('entities/:name/+', 'routes/entities/+/route.tsx'),
    route('entities/:name/edit/:id', 'routes/entities/edit/route.tsx'),
    route('files', 'routes/files/route.tsx'),
    layout('routes/settings/layout.tsx', [
      route('settings', 'routes/settings/route.tsx'),
      ...customRoutes.filter((route) => route.layout === 'settings'),
    ]),
    ...customRoutes.filter((route) => route.layout !== 'settings'),
  ]),
  route('*', 'routes/notFound/route.tsx'),
];

export default baseConfig;
