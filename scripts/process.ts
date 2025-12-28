import { spawn } from 'node:child_process';

export function pnpm(command: string) {
  return new Promise<void>((resolve, reject) => {
    const p = spawn(`pnpm ${command}`, { shell: true });

    let result: string = '';

    const pushToResult = (chunk: string) => {
      result += chunk;
    };

    p.stdout.on('data', pushToResult);
    p.stderr.on('data', pushToResult);

    p.on('exit', (code) => {
      if (code === 0) {
        resolve(undefined);
      } else {
        reject(new Error(result));
      }
    });
  });
}
