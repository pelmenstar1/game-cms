import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import { libraryWatcherPlugin } from '@game-cms/vite-plugins';
import { ignitePlugin } from './plugins/ignite/plugin';

export default defineConfig(() => ({
  plugins: [
    reactRouter(),
    libraryWatcherPlugin([
      'ui',
      'base-components',
      'game-plugin-components',
      'entity-previews',
    ]),
    ignitePlugin(),
  ],
}));
