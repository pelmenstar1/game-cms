import { pnpm } from './process';

const STYLELINT_PATTERN = `**/*.{css,scss}`;
const PRETTIER_PATTERN = '**.{ts,tsx,js,mjs,mts,json,css,scss,md,yml}';

async function phase(name: string, command: string) {
  try {
    await pnpm(command);
    console.log(`> ${name} finished`);
  } catch (error: unknown) {
    console.error(`> ${name}`);
    console.error(error);

    throw error;
  }
}

async function main() {
  const fix = process.argv[2] == '--fix';

  if (fix) {
    await phase('eslint', 'eslint --cache --cache-location .eslintcache --fix');
    await phase('stylelint', `stylelint --cache ${STYLELINT_PATTERN} --fix`);
    await phase('prettier', `prettier --cache --write ${PRETTIER_PATTERN}`);
  } else {
    try {
      await Promise.allSettled([
        phase('eslint', 'eslint --cache --cache-location .eslintcache'),
        phase('stylelint', `stylelint --cache ${STYLELINT_PATTERN}`),
        phase('prettier', `prettier --cache --check ${PRETTIER_PATTERN}`),
        phase('build', 'tsc --build tsconfig.ref.json'),
      ]);
    } catch {
      // Messages about errors are already in the terminal

      process.exit(1);
    }
  }
}

void main();
