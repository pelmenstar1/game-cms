import { Command } from 'commander';

import packageInfo from '../package.json' with { type: 'json' };
import build from './commands/build/index.js';
import dev from './commands/dev/index.js';
import start from './commands/start/index.js';

const program = new Command();

program
  .name('game-cms')
  .description('CLI to manage Game CMS')
  .version(packageInfo.version);

program
  .command('build')
  .description('Builds configs for the CMS')
  .action(build);

program.command('dev').description('Dev mode').action(dev);

program
  .command('start')
  .option('-d, --dashboard [DASHBOARD]', 'Dashboard URL')
  .description('Starts CMS server')
  .action(start);

program.parse();
