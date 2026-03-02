import { execFile } from 'node:child_process';
import path from 'node:path';

function convertToDistPath(filePath: string) {
  return filePath.replace(path.join('src', 'node'), path.join('dist', 'node'));
}

export async function runRemoteTest(filePath: string) {
  const distPath = convertToDistPath(filePath);

  return new Promise<void>((resolve, reject) => {
    execFile('node', [distPath], (error) => {
      if (error) {
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        reject(error);
      } else {
        resolve(undefined);
      }
    });
  });
}
