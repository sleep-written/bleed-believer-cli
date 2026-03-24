#!/usr/bin/env node
import { CLI } from './lib/cli/index.ts';

import { buildCommand } from './commands/build.command.ts';
import { startCommand } from './commands/start.command.ts';
import { helpCommand } from './commands/help.command.ts';

await new CLI()
    .addCommand(buildCommand)
    .addCommand(startCommand)
    .addCommand(helpCommand)
    .execute();