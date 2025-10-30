import type { ArgvParseInject } from './interfaces/index.js';
import { argvParse } from './argv.parse.js';

export class Argv {
    static parse(inject?: ArgvParseInject): Argv {
        const { main, flags } = argvParse(inject);
        return new Argv(main, flags);
    }

    #main: string[];
    get main(): string[] {
        return this.#main.slice();
    }

    #flags: Record<string, string[]>;
    get flags(): Record<string, string[]> {
        return structuredClone(this.#flags);
    }

    constructor(main: string[], flags?: Record<string, string[]>) {
        this.#main = main.slice();
        this.#flags = flags
        ?   structuredClone(flags)
        :   {};
    }
}