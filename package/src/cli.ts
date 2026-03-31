#!/usr/bin/env node
import { CLI, CommandNotFoundError } from './lib/cli/index.ts';

import { buildCommand } from './commands/build.command.ts';
import { startCommand } from './commands/start.command.ts';
import { helpCommand } from './commands/help.command.ts';

const cli = new CLI()
    .addCommand(buildCommand)
    .addCommand(startCommand)
    .addCommand(helpCommand);

try {
    await cli.execute();

} catch (err: any) {
    if (err instanceof CommandNotFoundError) {
        helpCommand.callback(
            {
                positionals: [],
                flags: {},
                args: []
            },
            cli.commands
        );

    } else {
        throw err;

    }
}