import { spawn } from 'node:child_process';

import { waitForProcessExit } from '../packages/shared/src/node';

export async function pnpm(command: string, cwd?: string) {
  const p = spawn(`pnpm ${command}`, { shell: true, cwd });

  let result: string = '';

  const pushToResult = (chunk: string) => {
    result += chunk;
  };

  p.stdout.on('data', pushToResult);
  p.stderr.on('data', pushToResult);

  const code = await waitForProcessExit(p);

  if (code !== 0) {
    throw new Error(result);
  }
}
