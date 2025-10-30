import type { ArgvRoute, Command, CommandContext } from '@lib/cli/index.js';
import { spawn } from 'child_process';

export const startCommand: ArgvRoute<void> = {
    path: [ 'start', ':target' ],
    target: class implements Command<void> {
        execute(context: CommandContext): Promise<void> {
            const target = context.params.target[0]!;
            const programArgs = context.flags['--'] ?? [];
            return new Promise<void>((resolve, reject) => {
                const args = [
                    '--import',
                    '@bleed-believer/cli',
                    target, ...programArgs
                ];

                if (context.flags['--watch'] instanceof Array) {
                    args.push('--watch');
                }

                const exe = process.argv[0];
                const cmd = spawn(exe, args, { stdio: 'inherit' });

                cmd.once('close', () => resolve());
                cmd.once('exit', () => resolve());
                cmd.once('error', er => reject(er));
            });
        }
    }
};