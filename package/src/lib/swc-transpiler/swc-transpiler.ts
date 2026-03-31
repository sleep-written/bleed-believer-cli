import type { Options, Output } from '@swc/core';
import type { SWCPlugin } from './interfaces/index.ts';

import { transform } from '@swc/core';

export class SWCTranspiler {
    #plugins: SWCPlugin[];

    constructor(plugins?: SWCPlugin[]) {
        this.#plugins = plugins ?? [];
    }

    transform(src: string, options: Options): Promise<Output> {
        return transform(src, {
            ...options,
            plugin: program => {
                if (options.plugin) {
                    program = options.plugin(program);
                }

                for (const plugin of this.#plugins) {
                    program = plugin.transform(program);
                }

                return program;
            }
        });
    }
}
