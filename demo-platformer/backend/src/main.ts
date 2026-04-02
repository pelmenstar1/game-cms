import { Command } from 'commander';

import { startServer } from './start.js';

const program = new Command();

program
  .command('start')
  .description('Start the server serving built frontend')
  .action(() => startServer());

program
  .command('dev')
  .description('Start the server proxying to a frontend dev server')
  .requiredOption('-f, --frontend <url>', 'Frontend dev server URL')
  .action((options: { frontend: string }) => startServer(options.frontend));

void program.parseAsync();
