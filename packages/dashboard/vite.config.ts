import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import {
  libraryWatcherPlugin,
  dashboardComponentsPlugin,
} from '@game-cms/vite-plugins';

export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    libraryWatcherPlugin('ui'),
    dashboardComponentsPlugin(),
  ],
});
