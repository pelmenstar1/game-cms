import type { Plugin } from 'vite';

import type { MaybePromise } from '../maybePromise.js';

export type VirtualModulePluginOptions = {
  pluginId: string;
  moduleId: string;
  generator: () => MaybePromise<string>;
};

export function virtualModulePlugin(
  options: VirtualModulePluginOptions
): Plugin {
  return {
    name: options.pluginId,
    resolveId(id) {
      if (id === options.moduleId) {
        return id;
      }

      return null;
    },
    async load(id) {
      if (id === options.moduleId) {
        const code = await options.generator();

        return { code };
      }
    },
  };
}
