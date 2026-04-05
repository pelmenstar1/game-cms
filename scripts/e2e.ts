import { spawn } from 'node:child_process';

import { waitForProcessExit } from '../packages/shared/src/node';

const TEST_RUNNER_SERVICE = 'test-runner';

const compose = (args: string) => {
  const child = spawn(`docker compose -f docker-compose-e2e.yml ${args}`, {
    shell: true,
    stdio: 'pipe',
  });

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  return child;
};

async function run() {
  const buildCode = await waitForProcessExit(compose('build'));

  if (buildCode !== 0) {
    console.error('Docker compose build failed');
    process.exit(buildCode ?? 1);
  }

  await waitForProcessExit(compose('up -d'));

  const logs = compose(`logs -f ${TEST_RUNNER_SERVICE}`);

  const testCode = await waitForProcessExit(
    compose(`wait ${TEST_RUNNER_SERVICE} --down-project`)
  );

  logs.kill();

  process.exit(testCode ?? 1);
}

await run();
