#! /usr/bin/env node
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import yargs from 'yargs';

import { buildCommand } from '@cli/build.command.js';
import { startCommand } from '@cli/start.command.js';

const argv = await yargs(process.argv.slice(2))
    .detectLocale(false)
    .command(buildCommand)
    .command(startCommand)
    .parse();

if (argv._.length === 0) {
    const path = resolve(
        fileURLToPath(import.meta.url),
        '../../banner.txt'
    );

    const banner = await readFile(path, 'utf-8');
    console.log(banner);
}