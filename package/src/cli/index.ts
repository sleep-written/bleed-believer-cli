import { Argv, Cli } from '@lib/cli/index.js';

import { buildCommand } from './build.command.js';
import { startCommand } from './start.command.js';
import { watchCommand } from './watch.command.js';

export const cli = new Cli(Argv.parse(), [
    buildCommand,
    startCommand,
    watchCommand,
]);