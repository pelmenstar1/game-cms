import { Plugin } from 'vite';
import { watch } from 'chokidar';
import path from 'node:path';

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

      console.log('server configured');

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
