import { builtinModules } from 'node:module';
import path from 'node:path';

import {
  COMPONENT_CLIENT_SUFFIX,
  EXTERNAL_SHARED_ASSETS,
  type ExternalSharedAsset,
  SHARED_ASSETS_PATHS,
} from '@game-cms/build';
import { glob } from 'glob';
import type { ConfigEnv, PluginOption } from 'vite';

import { getComponentStaticConfigMap } from './bundle.js';
import { getComponentSourceFile } from './emit.js';
import { sanitizePluginName } from './utils.js';

async function getClientBundles() {
  const result: Record<string, string> = {};

  for (const entry of await glob('./src/*/*')) {
    const name = path.basename(path.dirname(entry));

    if (entry.endsWith('client.tsx')) {
      result[`${name}${COMPONENT_CLIENT_SUFFIX}`] = entry;
    }
  }

  return result;
}

async function getServerBundles() {
  const result: Record<string, string> = {
    index: './src/index.ts',
  };

  for (const entry of await glob('./src/*/*')) {
    const name = path.basename(path.dirname(entry));

    if (entry.endsWith('index.ts')) {
      result[name] = entry;
    } else if (entry.endsWith('meta.ts')) {
      result[`${name}-meta`] = entry;
    }
  }

  return result;
}

async function getPaths() {
  const result: Record<string, string> = {};

  for (const entry of await glob('./src/*/*')) {
    const name = path.basename(path.dirname(entry));

    result[`./${name}`] = `${name}.js`;
  }

  return result;
}

export interface ComponentPluginOptions {
  cmsPluginName: string;
  registryModulePath: string;
}

export function componentPlugin(options: ComponentPluginOptions): PluginOption {
  const cssPluginName = sanitizePluginName(options.cmsPluginName);
  let env: ConfigEnv;

  return {
    name: 'game-cms:component',
    config: async (_, _env: ConfigEnv) => {
      env = _env;

      const { isSsrBuild = false } = env;

      return {
        define: {
          'process.env.NODE_ENV': '"production"',
        },
        build: {
          manifest: !isSsrBuild,
          lib: {
            formats: ['es'],
            entry: isSsrBuild
              ? await getServerBundles()
              : await getClientBundles(),
          },
          rollupOptions: {
            external: [...EXTERNAL_SHARED_ASSETS, ...builtinModules, 'zod'],
            output: {
              assetFileNames: '[name][extname]',
              entryFileNames: '[name].js',
              paths: { ...SHARED_ASSETS_PATHS, ...(await getPaths()) },
            },
            treeshake: {
              moduleSideEffects: (id, external) => {
                if (
                  EXTERNAL_SHARED_ASSETS.includes(id as ExternalSharedAsset)
                ) {
                  return false;
                }

                return !external;
              },
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
      if (env.isSsrBuild) {
        const staticConfigMap = await getComponentStaticConfigMap(bundle);

        this.emitFile({
          fileName: 'source.js',
          type: 'prebuilt-chunk',
          code: getComponentSourceFile(staticConfigMap),
        });

        this.emitFile({
          fileName: 'source.d.ts',
          type: 'prebuilt-chunk',
          code: `declare const _default: import('@game-cms/types').ComponentSource; export default _default;`,
        });
      }
    },
  };
}
