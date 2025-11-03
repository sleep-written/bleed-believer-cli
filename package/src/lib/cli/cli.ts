import type { ArgvRoute } from './interfaces/index.js';
import type { Argv } from './argv.js';

import { CommandNotFoundError } from './command-not-found.error.js';

const regexParam = /^:(?<name>[a-z0-9]+)$/i;

export class Cli<T> {
    #routes: ArgvRoute<T>[];
    #argv: Argv;

    constructor(argv: Argv, routes: ArgvRoute<T>[]) {
        this.#argv = argv;
        this.#routes = routes;
    }

    docs() {
        return this.#routes.map(x => ({
            name: x.name,
            info: x.info }
        ));
    }

    async execute(): Promise<T> {
        for (const { path, target } of this.#routes) {
            if (
                (path.at(-1) !== '...' && path.length !== this.#argv.main.length) ||
                (path.at(-1) === '...' && path.length  >  this.#argv.main.length)
            ) {
                continue;
            }

            let tail: string[] = [];
            let execute = true;
            const flags = this.#argv.flags;
            const params: Record<string, string[]> = {};
            for (let i = 0; i < path.length; i++) {
                const pathFragment = path[i]!;
                const mainFragment = this.#argv.main[i]!;

                if (regexParam.test(pathFragment)) {
                    const { name } = regexParam.exec(pathFragment)?.groups ?? {};
                    const values = params[name] ?? [];
                    values.push(mainFragment);
                    params[name] = values;

                } else if (pathFragment === '...') {
                    tail = this.#argv.main.slice(i);
                    break;

                } else if (pathFragment !== mainFragment) {
                    execute = false;
                    break;

                }
            }

            if (execute) {
                return new target().execute({
                    tail,
                    flags,
                    params,
                });
            }
        }

        throw new CommandNotFoundError(this.#argv.main);
    }
}