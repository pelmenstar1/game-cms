import fsp from "node:fs/promises";
import { defineConfig, UserConfig } from "vite";
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { EXTERNAL_SHARED_ASSETS, SHARED_ASSETS_PATHS } from "@game-cms/build";
import dts from 'vite-plugin-dts';

async function getEntries() {
  const result: Record<string, string> = {
    index: './src/index.ts',
  };

  for await (const entry of fsp.glob('./src/*/*')) {
    const name = path.basename(path.dirname(entry));

    if (entry.endsWith('renderer.tsx')) {
      result[`${name}-renderer`] = entry;
    } else if (entry.endsWith('index.ts')) {
      result[name] = entry;
    }
  }

  return result;
}

async function getPaths() {
  const result: Record<string, string> = {};

  for await (const entry of fsp.glob('./src/*/*')) {
    const name = path.basename(path.dirname(entry));
  
    result[`./${name}`] = `${name}.js`;
  }

  return result;
}

export default defineConfig(async (): Promise<UserConfig> => ({
  plugins: [
    react(),
    dts()
  ],
  build: {
    manifest: true,
    lib: {
      formats: ['es'],
      entry: await getEntries(),
    },
    rollupOptions: {
      external: [...EXTERNAL_SHARED_ASSETS, 'zod'],
      output: {
        assetFileNames: '[name][extname]',
        entryFileNames: '[name].js',
        paths: { ...SHARED_ASSETS_PATHS, ...await getPaths() },
      },
    },
    cssCodeSplit: true,
  },
  css: {
    modules: {
      generateScopedName: 'base_components_[name]_[local]_[hash:base64:5]',
    }
  },
}));
