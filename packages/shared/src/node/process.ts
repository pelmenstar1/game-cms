import {
  type ChildProcessWithoutNullStreams,
  spawn,
  type SpawnOptionsWithoutStdio,
} from 'node:child_process';
import process from 'node:process';

export function spawnProcessAsync(
  command: string,
  options: SpawnOptionsWithoutStdio | undefined,
  setup?: (p: ChildProcessWithoutNullStreams) => void
) {
  return new Promise((resolve, reject) => {
    const spawnedProcess = spawn(command, options);

    setup?.(spawnedProcess);

    spawnedProcess.on('exit', (code) => {
      if (code === 0) {
        resolve(undefined);
      } else {
        reject(new Error(`Process failed with code ${code}`));
      }
    });
  });
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
