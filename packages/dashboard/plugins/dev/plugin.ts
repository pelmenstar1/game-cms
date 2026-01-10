import net from 'node:net';

import type { Plugin } from 'vite';

type DevPluginOptions = {
  messagePort?: number;
};

export function devPlugin(options: DevPluginOptions = {}): Plugin {
  return {
    name: 'game-cms:dev',
    apply: 'serve',
    configureServer: (server) => {
      server.httpServer?.once('listening', () => {
        const port = options.messagePort;

        if (port) {
          const socket = net.connect({
            host: 'localhost',
            port,
          });

          socket.on('connect', () => {
            socket.end('VITE_UP');
          });

          socket.on('error', (error) => {
            console.error(error);
          });
        }
      });
    },
  };
}
