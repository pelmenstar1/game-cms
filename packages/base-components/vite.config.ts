import { defineConfig, UserConfig } from "vite";
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { componentPlugin } from '@game-cms/vite-plugins';
import { name as packageName } from './package.json';

export default defineConfig({
  plugins: [
    componentPlugin({ cmsPluginName: packageName, registryModulePath: '' }),
    react(),
    dts()
  ],
});
