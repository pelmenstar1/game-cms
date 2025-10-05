import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { watchNodeModules } from 'vite-plugin-watch-node-modules';
import path from "node:path";
import { libraryWatcherPlugin } from "@game-cms/vite-plugins";

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths(), libraryWatcherPlugin('ui')],
});
