import path from 'node:path';

import { watch } from 'chokidar';
import type { Plugin } from 'vite';

export function libraryWatcherPlugin(name: string): Plugin {
  return {
    name: 'library-watcher',
    apply: 'serve',
    configureServer: (server) => {
      const watchDir = `../${name}/dist`;
      const watcher = watch(watchDir, {
        ignoreInitial: true,
        usePolling: true,
      });

      watcher.on('change', (filePath) => {
        if (filePath.endsWith('.tsbuildinfo')) {
          return;
        }

        const dirname = path.dirname(filePath);
        const modules = [...server.moduleGraph.idToModuleMap.entries()];

        const modulesToReload = modules.filter(([key]) =>
          key.startsWith(dirname)
        );

        for (const [, module] of modulesToReload) {
          void server.reloadModule(module);
        }

        console.log(
          `Reloaded: ${modulesToReload.map(([key]) => key).join(', ')}`
        );
      });

      server.httpServer?.on('close', () => {
        void watcher.close();
      });
      // server.moduleGraph.getModulesByFile()
    },
  };
}
