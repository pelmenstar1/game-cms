import chalk from 'chalk';

import { printError, printInfo } from './print';
import { pnpm } from './process';

const STYLELINT_COMMAND =
  'stylelint --cache --cache-location node_modules/.cache/.stylelintcache "**/*.{css,scss}"';

const PRETTIER_COMMAND =
  'prettier --cache "**.{ts,tsx,js,mjs,mts,json,css,scss,md,yml,html}"';

const ESLINT_COMMAND =
  'eslint --cache --cache-location node_modules/.cache/.eslintcache';

async function phase(name: string, command: string) {
  try {
    await pnpm(command);

    printInfo(`${chalk.green(name)} finished`);
  } catch (error: unknown) {
    printError(name);
    console.error(error instanceof Error ? error.message : error);

    throw error;
  }
}

async function main() {
  const fix = process.argv[2] == '--fix';

  try {
    if (fix) {
      await phase('eslint', `${ESLINT_COMMAND} --fix`);
      await phase('stylelint', `${STYLELINT_COMMAND} --fix`);
      await phase('prettier', `${PRETTIER_COMMAND} --write`);

      return;
    } else {
      const result = await Promise.allSettled([
        phase('eslint', ESLINT_COMMAND),
        phase('stylelint', STYLELINT_COMMAND),
        phase('prettier', `${PRETTIER_COMMAND} --check`),
        phase('build', 'tsc --build tsconfig.ref.json'),
        phase('knip', 'knip'),
      ]);

      if (result.every((value) => value.status === 'fulfilled')) {
        return;
      }
    }
  } catch {
    // Messages about errors are already in the terminal
  }

  process.exit(1);
}

void main();
