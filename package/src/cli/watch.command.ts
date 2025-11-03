import type { ArgvRoute, Command, CommandContext } from '@lib/cli/index.js';

import { Launcher } from '@lib/launcher/index.js';

export const watchCommand: ArgvRoute<void> = {
    name: 'npx bleed watch <target>',
    info: 'Same as `start`, but watches file changes.',

    path: [ 'watch', ':target' ],
    target: class implements Command<void> {
        execute(context: CommandContext): Promise<void> {
            const target = context.params.target[0]!;
            const launcher = new Launcher(target);
            return launcher.execute(true);
        }
    }
};