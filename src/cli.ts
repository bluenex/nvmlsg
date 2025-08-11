#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { join } from 'path';
import { lsCommand } from './commands/ls';

const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf8')
);

const program = new Command();

program
  .name('nvmlsg')
  .description(
    'CLI tool to list global npm packages for all Node.js versions in nvm'
  )
  .version(packageJson.version);

program
  .command('ls')
  .description('List global npm packages for all Node.js versions')
  .action(lsCommand);

// Default command when no subcommand is provided
program.action(() => {
  lsCommand();
});

program.parse();
