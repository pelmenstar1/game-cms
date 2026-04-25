import {
  type ChildProcessWithoutNullStreams,
  spawn,
  type SpawnOptionsWithoutStdio,
} from 'node:child_process';
import process from 'node:process';

export function waitForProcessExit(
  process: ChildProcessWithoutNullStreams
): Promise<number | null> {
  return new Promise((resolve) => {
    process.on('exit', resolve);
  });
}

export async function spawnProcessAsync(
  command: string,
  options: SpawnOptionsWithoutStdio | undefined,
  setup?: (p: ChildProcessWithoutNullStreams) => void
) {
  const spawnedProcess = spawn(command, options);
  setup?.(spawnedProcess);

  const code = await waitForProcessExit(spawnedProcess);

  if (code !== 0) {
    throw new Error(`Process failed with code ${code}`);
  }
}

export function redirectProcess(
  command: string,
  options?: SpawnOptionsWithoutStdio
) {
  return spawnProcessAsync(command, options, (p) => {
    p.stdout.pipe(process.stdout);
    p.stderr.pipe(process.stderr);
  });
}

export function onShutdown(callback: () => void) {
  process.once('SIGTERM', callback);
  process.once('SIGINT', callback);
}
