import type { ArgvOutput, ArgvSettings, CLIInject, Command } from './interfaces/index.ts';

import { CommandNotFoundError } from './command-not-found.error.ts';
import { ArgvParserError } from './argv-parser.error.ts';
import { argvParser } from './argv-parser.ts';

export class CLI {
    static createCommand<
        S extends ArgvSettings,
        O extends ArgvOutput<S>
    >(
        settings: S,
        callback: (
            output: O,
            context: Command<ArgvSettings>[]
        ) => unknown
    ): Command<S> {
        return { settings, callback: callback as any };
    }

    #injected: Required<CLIInject>;
    #commands = new Set<Command<ArgvSettings>>();
    get commands(): Command<ArgvSettings>[] {
        return Array.from(this.#commands);
    }

    constructor(inject?: CLIInject) {
        this.#injected = {
            process: inject?.process ?? process
        };
    }

    addCommand<S extends ArgvSettings>(command: Command<S>): CLI {
        this.#commands.add(command);
        return this;
    }

    async execute(): Promise<void> {
        for (const { settings, callback } of this.#commands) {
            try {
                const output = argvParser(settings, this.#injected.process);
                await callback(output, Array.from(this.#commands));
                return;

            } catch (err: any) {
                if (
                    err instanceof ArgvParserError ||
                    typeof err.code === 'string' && (
                        (err.code as string).startsWith('ERR_PARSE_ARGS_')
                    )
                ) {
                    continue;
                } else {
                    throw err;
                }
            }
        }

        throw new CommandNotFoundError();
    }
}