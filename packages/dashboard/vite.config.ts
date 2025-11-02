import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { libraryWatcherPlugin } from "@game-cms/vite-plugins";
import { EXTERNAL_SHARED_ASSETS, SHARED_ASSETS_PATHS } from '@game-cms/build';

export default defineConfig((env) => ({
  plugins: [reactRouter(), tsconfigPaths(), libraryWatcherPlugin('ui')],
  build: {
    manifest: true,
    minify: 'esbuild',
    rollupOptions: env.isSsrBuild ? {} : {
      external: EXTERNAL_SHARED_ASSETS,
      output: {
        paths: SHARED_ASSETS_PATHS,
      },
    }
  },
}));
