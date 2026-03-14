import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { redirectProcess, resolvePackageBin } from '@game-cms/shared/node';

const DEV_PACKAGE = '@react-router/dev';

export async function runReactRouterBin(command: string) {
  const rrPackagePath = fileURLToPath(
    import.meta.resolve(`${DEV_PACKAGE}/package.json`)
  );

  const binRelativePath = await resolvePackageBin(
    rrPackagePath,
    'react-router'
  );

  if (!binRelativePath) {
    throw new Error(`"bin" of "${DEV_PACKAGE}" is empty`);
  }

  const binPath = path.join(path.dirname(rrPackagePath), binRelativePath);

  await redirectProcess(`node "${binPath}" ${command}`, {
    shell: true,
    cwd: path.join(import.meta.dirname, '../'),
  });
}
