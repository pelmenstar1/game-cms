import chalk from 'chalk';

function statusText(text: string) {
  return `${chalk.magenta('>')} ${text}`;
}

export function statusError(text: string) {
  console.log(`${chalk.red('>')} ${text}`);
}

export function statusInline(text: string) {
  process.stdout.write(`\r${statusText(text)}`);
}
