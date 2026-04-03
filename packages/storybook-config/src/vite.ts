import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

export const viteConfig = (plugins?: Plugin[]) =>
  defineConfig({
    publicDir: false,
    plugins: [react(), ...(Array.isArray(plugins) ? plugins : [])],
  });
