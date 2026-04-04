import chalk from 'chalk';

/* eslint-disable no-console */
export function printInfo(message: string) {
  console.log(`${chalk.gray('>')} ${message}`);
}

export function printError(message: string) {
  console.error(chalk.red(`> ${message}`));
}
