import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export const viteConfig = (plugins: Plugin[] = []) =>
  defineConfig({
    publicDir: false,
    plugins: [react(), tsconfigPaths(), ...plugins],
  });
