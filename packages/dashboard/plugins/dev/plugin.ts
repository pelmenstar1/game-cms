import net, { AddressInfo } from 'node:net';

import { DevMessageTunnel, DevServerManifest } from '@game-cms/ignition';
import { addressInfoToHttpUrl } from '@game-cms/shared/node';
import type { HttpServer, Plugin } from 'vite';

type DevPluginOptions = {
  messageTunnel?: DevMessageTunnel;
};

function createDevServerManifest(server: HttpServer): DevServerManifest {
  const info = server.address() as AddressInfo;

  return { address: addressInfoToHttpUrl(info) };
}

export function devPlugin(options: DevPluginOptions = {}): Plugin {
  return {
    name: 'game-cms:dev',
    apply: 'serve',
    configureServer: (server) => {
      const { httpServer } = server;

      httpServer?.once('listening', () => {
        const { messageTunnel } = options;

        if (messageTunnel) {
          const socket = net.connect({
            host: messageTunnel.address,
            port: messageTunnel.port,
            family: messageTunnel.family === 'v4' ? 4 : 6,
          });

          socket.on('connect', () => {
            const manifest = createDevServerManifest(httpServer);

            socket.end(JSON.stringify(manifest));
          });

          socket.on('error', (error) => {
            console.error(error);
          });
        }
      });
    },
  };
}
