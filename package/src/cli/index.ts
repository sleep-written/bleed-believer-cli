import { Argv, Cli } from '@lib/cli/index.js';

import { startCommand } from './start.command.js';
import { buildCommand } from './build.command.js';

export const cli = new Cli(Argv.parse(), [
    startCommand,
    buildCommand
]);