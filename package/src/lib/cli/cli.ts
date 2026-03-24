import type { ArgvOutput, ArgvSettings, CLIInject, Command } from './interfaces/index.ts';

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

            } catch (err) {
                if (err instanceof ArgvParserError) {
                    continue;
                } else {
                    throw err;
                }
            }
        }

        throw new Error(`None command matched with the provided arguments.`);
    }
}