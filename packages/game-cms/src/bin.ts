import { Command } from 'commander';
import build from './commands/build.js';
import start from './commands/start.js';

import packageInfo from '../package.json' with { type: 'json' };

const program = new Command();

program
  .name('game-cms')
  .description('CLI to manage Game CMS')
  .version(packageInfo.version);

program
  .command('build')
  .description('Builds configs for the CMS')
  .action(build);

program.command('start').description('Starts CMS server').action(start);

program.parse();
