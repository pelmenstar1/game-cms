import { reactRouter } from '@react-router/dev/vite';
import { defineConfig, type Plugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { libraryWatcherPlugin } from '@game-cms/vite-plugins';
import { dashboardComponentsPlugin } from './plugins/components/plugin';

export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    libraryWatcherPlugin('ui') as Plugin,
    dashboardComponentsPlugin() as Plugin,
  ],
});
