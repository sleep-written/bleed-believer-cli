import type { CommandModule } from 'yargs';
import { Launcher } from '@lib/launcher/index.js';

interface Argv {
    target: string;
    watch?: boolean;
    '--'?: string[];
}

export const startCommand: CommandModule<{}, Argv> = {
    command:    'start [target]',
    describe:   'Execute the target file with SWC under the hood',
    builder:    yargs => yargs
        .options('target', {
            string: true,
            description: 'The file do you want to execute',
            demandOption: true
        })
        .options('watch', {
            boolean: true,
            description: 'Activate "watch" mode'
        })
        .parserConfiguration({
            "populate--": true
        }),
    handler: argv => {
        const launcher = new Launcher(argv.target, argv['--']);
        return launcher.execute(argv.watch);
    }
}