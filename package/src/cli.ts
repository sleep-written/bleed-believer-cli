#! /usr/bin/env node
import yargs from 'yargs';

import { buildCommand } from '@cli/build.command.js';
import { startCommand } from '@cli/start.command.js';

yargs(process.argv.slice(2))
    .detectLocale(false)
    .command(buildCommand)
    .command(startCommand)
    .parse();