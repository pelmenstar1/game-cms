import fsp from 'node:fs/promises';
import { builtinModules } from 'node:module';
import path from 'node:path';

import {
  COMPONENT_RENDERER_SUFFIX,
  EXTERNAL_SHARED_ASSETS,
  SHARED_ASSETS_PATHS,
} from '@game-cms/build';
import type { Plugin } from 'vite';

import { getComponentStaticConfigMap } from './bundle.js';
import { getComponentSourceFile } from './emit.js';
import { sanitizePluginName } from './utils.js';

async function getBundles() {
  const result: Record<string, string> = {
    index: './src/index.ts',
  };

  for await (const entry of fsp.glob('./src/*/*')) {
    const name = path.basename(path.dirname(entry));

    if (entry.endsWith('renderer.tsx')) {
      result[`${name}${COMPONENT_RENDERER_SUFFIX}`] = entry;
    } else if (entry.endsWith('index.ts')) {
      result[name] = entry;
    } else if (entry.endsWith('meta.ts')) {
      result[`${name}-meta`] = entry;
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

export interface ComponentPluginOptions {
  cmsPluginName: string;
  registryModulePath: string;
}

export function componentPlugin(options: ComponentPluginOptions): Plugin {
  const cssPluginName = sanitizePluginName(options.cmsPluginName);

  return {
    name: 'game-cms:component',
    async config() {
      return {
        build: {
          lib: {
            formats: ['es'],
            entry: await getBundles(),
          },
          rollupOptions: {
            external: [...EXTERNAL_SHARED_ASSETS, ...builtinModules, 'zod'],
            output: {
              assetFileNames: '[name][extname]',
              entryFileNames: '[name].js',
              paths: { ...SHARED_ASSETS_PATHS, ...(await getPaths()) },
            },
          },
          cssCodeSplit: true,
        },
        css: {
          modules: {
            generateScopedName: `${cssPluginName}_[name]_[hash:base64:5]`,
          },
        },
      };
    },
    async generateBundle(_, bundle) {
      const staticConfigMap = await getComponentStaticConfigMap(bundle);

      this.emitFile({
        fileName: 'source.js',
        type: 'prebuilt-chunk',
        code: getComponentSourceFile(staticConfigMap),
      });
    },
  };
}
