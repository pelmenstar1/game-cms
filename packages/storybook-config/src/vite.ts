import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export const viteConfig = () =>
  defineConfig({
    publicDir: false,
    plugins: [react(), tsconfigPaths()],
  });
