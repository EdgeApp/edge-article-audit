#!/usr/bin/env node

import chalk from 'chalk'
import { Command } from 'commander'

import { pullCommand, pushCommand } from './commands'
import { loadConfig } from './config'

const program = new Command()

program
  .name('edge-article-audit')
  .description('CLI tool for editing Intercom Help Center articles as Markdown')
  .version('1.0.0')

program
  .command('pull')
  .description('Fetch articles from Intercom and save as Markdown')
  .option('-a, --all', 'Pull all articles')
  .option('-i, --id <id>', 'Pull a single article by ID')
  .option(
    '-c, --clean',
    'Remove local articles that no longer exist on Intercom (use with --all)'
  )
  .action(async options => {
    try {
      const config = loadConfig()
      await pullCommand(config, options)
    } catch (error) {
      console.error(chalk.red('Error:'), (error as Error).message)
      process.exit(1)
    }
  })

program
  .command('push')
  .description('Push local Markdown changes back to Intercom')
  .option('-a, --all', 'Push all articles')
  .option('-i, --id <id>', 'Push a single article by ID')
  .option('-f, --force', 'Push all articles regardless of changes')
  .option('-n, --dry-run', 'Show what would be pushed without making changes')
  .action(async options => {
    try {
      const config = loadConfig()
      await pushCommand(config, options)
    } catch (error) {
      console.error(chalk.red('Error:'), (error as Error).message)
      process.exit(1)
    }
  })

// Parse arguments
program.parse()
