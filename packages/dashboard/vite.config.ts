import { reactRouter } from '@react-router/dev/vite';
import { defineConfig, type Plugin, type PluginOption } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { libraryWatcherPlugin } from '@game-cms/vite-plugins';
import { ignitePlugin } from './plugins/ignite/plugin';

export default defineConfig(() => ({
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    libraryWatcherPlugin([
      'ui',
      'base-components',
      'game-plugin-components',
      'entity-previews',
    ]),
    ignitePlugin() as PluginOption,
  ],
}));
