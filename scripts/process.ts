import { execFile } from 'node:child_process';

export function execFileAsync(file: string, args: string[], cwd?: string) {
  return new Promise((resolve, reject) => {
    execFile(file, args, { cwd, shell: true }, (error, stdout, stderr) => {
      const message = `${stdout}\n${stderr}`;

      if (error) {
        reject(new Error(message, { cause: error }));
      } else {
        resolve(message);
      }
    });
  });
}

export function pnpm(args: string[], cwd?: string) {
  return execFileAsync('pnpm', args, cwd);
}
