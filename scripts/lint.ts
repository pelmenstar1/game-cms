import { pnpm } from './process';

const STYLELINT_PATTERN = `**/*.{css,scss}`;
const PRETTIER_PATTERN = '**.{ts,tsx,js,mjs,mts,json,css,scss,md,yml}';
const ESLINT_COMMAND = 'eslint --cache --cache-location .eslintcache';

async function phase(name: string, command: string) {
  try {
    await pnpm(command);
    console.log(`> ${name} finished`);
  } catch (error: unknown) {
    console.error(`> ${name}`);
    console.error(error);
  }
}

async function main() {
  const fix = process.argv[2] == '--fix';

  try {
    if (fix) {
      await phase('eslint', `${ESLINT_COMMAND} --fix`);
      await phase('stylelint', `stylelint --cache ${STYLELINT_PATTERN} --fix`);
      await phase('prettier', `prettier --cache --write ${PRETTIER_PATTERN}`);
    } else {
      await Promise.allSettled([
        phase('eslint', ESLINT_COMMAND),
        phase('stylelint', `stylelint --cache ${STYLELINT_PATTERN}`),
        phase('prettier', `prettier --cache --check ${PRETTIER_PATTERN}`),
        phase('build', 'tsc --build tsconfig.ref.json'),
        phase('knip', 'knip'),
      ]);
    }
  } catch {
    // Messages about errors are already in the terminal

    process.exit(1);
  }
}

void main();
