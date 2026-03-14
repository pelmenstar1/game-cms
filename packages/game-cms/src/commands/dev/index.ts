import net, { type AddressInfo } from 'node:net';

import { dev as dashboardDev } from '@game-cms/dashboard';
import {
  DevMessageTunnel,
  DevServerManifest,
  devServerManifest,
  initEnvFromConfigs,
  writeDashboardBuildMeta,
} from '@game-cms/ignition';

import { getDashboardPackagePath } from '../../services/dashboard/index.js';
import { executeRemainingMigrations } from '../../services/migration.js';
import { startServer } from '../../services/server.js';

async function startMessageServer() {
  const server = net.createServer();

  const address = await new Promise<AddressInfo>((resolve, reject) => {
    server.once('error', reject);

    server.listen(0, () => {
      resolve(server.address() as AddressInfo);
    });
  });

  const tunnel: DevMessageTunnel = {
    address: address.address,
    port: address.port,
    family: address.family === 'IPv4' ? 'v4' : 'v6',
  };

  return {
    tunnel,
    waitUntilViteUp: () =>
      new Promise<DevServerManifest>((resolve) => {
        server.on('connection', (socket) => {
          socket.on('data', (data) => {
            if (typeof data !== 'string') {
              data = data.toString('utf8');
            }

            const objectData: unknown = JSON.parse(data);
            const manifest = devServerManifest.parse(objectData);

            resolve(manifest);
          });
        });
      }),
    [Symbol.dispose]: () => {
      server.close();
    },
  };
}

export default async function dev() {
  const dashboardPath = getDashboardPackagePath();

  let devManifest: DevServerManifest;

  {
    using messageServer = await startMessageServer();

    await writeDashboardBuildMeta(dashboardPath, messageServer.tunnel);
    await initEnvFromConfigs();

    void dashboardDev();

    await executeRemainingMigrations();

    devManifest = await messageServer.waitUntilViteUp();
  }

  await startServer({ dashboard: devManifest.address });
}
