import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import { libraryWatcherPlugin } from '@game-cms/vite-plugins';
import { ignitePlugin } from './plugins/ignite/plugin';

export default defineConfig((env) => ({
  resolve: {
    tsconfigPaths: true,
  },
  css: {
    modules: {
      generateScopedName:
        env.command === 'serve' ? '[name]_[local]_[hash:base64:5]' : undefined,
    },
  },
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
