/* eslint-disable no-console */
import { spawn } from 'node:child_process';

import { waitForProcessExit } from '../packages/shared/src/node';

const compose = (args: string) =>
  spawn(`docker compose -f docker-compose-e2e.yml ${args}`, {
    shell: true,
    stdio: 'pipe',
  });

async function run() {
  // Build first
  const build = compose('build');
  build.stdout.pipe(process.stdout);
  build.stderr.pipe(process.stderr);

  const buildCode = await waitForProcessExit(build);

  if (buildCode !== 0) {
    console.error('Docker compose build failed');
    process.exit(buildCode ?? 1);
  }

  // Start services
  const up = compose('up --abort-on-container-exit');

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const onData = (chunk: Buffer) => {
    const lines = chunk.toString().split('\n');
    for (const line of lines) {
      if (line.trim() && !line.includes('mongodb')) {
        console.log(line);
      }
    }
  };

  up.stdout.on('data', onData);
  up.stderr.on('data', onData);

  await waitForProcessExit(up);
}

await run();
