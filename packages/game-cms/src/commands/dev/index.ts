import childProcess from 'node:child_process';
import net, { type AddressInfo } from 'node:net';

import { setCmsController } from '@game-cms/global';
import { createController, initEnvFromConfigs } from '@game-cms/ignition';

import {
  getDashboardPackagePath,
  writeDashboardMeta,
} from '../../services/dashboard/index.js';
import { executeRemainingMigrations } from '../../services/migration.js';
import { startServer } from '../../services/server.js';

function runDashboardDev(dashboardPath: string) {
  const p = childProcess.spawn('npm run dev', {
    shell: true,
    cwd: dashboardPath,
  });

  p.stdout.pipe(process.stdout);
  p.stderr.pipe(process.stderr);
}

async function startMessageServer() {
  const server = net.createServer();

  const port = await new Promise<number>((resolve, reject) => {
    server.once('error', reject);

    server.listen(0, () => {
      resolve((server.address() as AddressInfo).port);
    });
  });

  return {
    port,
    waitUntilViteUp: () =>
      new Promise<void>((resolve) => {
        server.on('connection', (socket) => {
          socket.on('data', (data) => {
            if (data instanceof Buffer) {
              data = data.toString('utf8');
            }

            if (data === 'VITE_UP') {
              resolve(undefined);
            }
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

  {
    using messageServer = await startMessageServer();

    await writeDashboardMeta(dashboardPath, messageServer.port);
    await initEnvFromConfigs();

    setCmsController(createController());
    runDashboardDev(dashboardPath);

    await executeRemainingMigrations();

    await messageServer.waitUntilViteUp();
  }

  await startServer({ dashboard: 'http://localhost:5173' });
}
