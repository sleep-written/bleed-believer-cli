#!/usr/bin/env node
import { CLI, CommandNotFoundError } from './lib/cli/index.ts';
import { banner } from './banner.ts';

import { buildCommand } from './commands/build.command.ts';
import { startCommand } from './commands/start.command.ts';
import { helpCommand } from './commands/help.command.ts';
import { styleText } from 'node:util';

const cli = new CLI()
    .addCommand(buildCommand)
    .addCommand(startCommand)
    .addCommand(helpCommand);

try {
    await cli.execute();

} catch (err: any) {
    if (err instanceof CommandNotFoundError) {
        console.log(banner);
        console.log(''.padStart(15, ' '), styleText('red', `Sense of me and time fall away`));
        console.log(''.padStart(16, ' '), styleText('red', `Good to meet you in the fire`));
        console.log(''.padStart(15, ' '), styleText('red', `Sense of me and time fall away`));
        console.log(''.padStart(22, ' '), styleText('magenta', `(Want to see you)`));
        console.log(''.padStart(17, ' '), styleText('red', `Don't be alive to fall away`));
        console.log();
        console.log(''.padStart(21, ' '), styleText('gray', ''.padStart(17, '-')));
        console.log();
        console.log([
            'Type',
            styleText('blueBright', 'help'),
            'to show the available commands...'
        ].join(' '));

    } else {
        throw err;

    }
}