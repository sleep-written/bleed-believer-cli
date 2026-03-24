import { spawn } from 'node:child_process';
import { CLI } from '../lib/cli/index.ts';

export const startCommand = CLI.createCommand(
    {
        positionals: [ 'start', ':target' ] as const,
        options: {
            watch: {
                short: 'w',
                type: 'boolean',
                default: false,
                info: 'Run the file as "watch" mode'
            },
            config: {
                short: 'c',
                type: 'string',
                info: 'Sets the tsconfig.json do you want to use'
            }
        },
        info: 'Run typescript code using @bleed-believer/cli'
    },
    async o => new Promise<void>((resolve, reject) => {
        const env: NodeJS.ProcessEnv = {
            ...process.env,
            // FORCE_COLOR: '1'
        };

        if (typeof o.flags.config === 'string') {
            env['BLEED-BELIEVER-CLI-TSCONFIG'] = o.flags.config;
        }

        const args = [ '--import', '@bleed-believer/cli', o.positionals.target, ...o.args ];
        if (o.flags.watch) {
            args.unshift('--watch');
        }

        const task = spawn('node', args, {
            env,
            stdio: 'inherit'
        });

        task.on('error', (err: Error) => {
            task.removeAllListeners();
            reject(err);
        });

        task.on('exit', () => {
            task.removeAllListeners();
            resolve();
        });
    })
);