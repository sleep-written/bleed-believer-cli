import type { TsconfigObject, TranspilerInject } from './interfaces/index.ts';
import type { Config, Options, Output, Program } from '@swc/core';

import { tsconfigToSwcrc } from './tsconfig-to-swcrc.ts';
import { transform } from '@swc/core';

export class Transpiler {
    #swcSettings: Config;
    #injected: Required<TranspilerInject>;

    constructor(tsconfig: TsconfigObject, inject?: TranspilerInject) {
        this.#swcSettings = tsconfigToSwcrc(tsconfig);
        this.#injected = {
            transform:  inject?.transform?.bind(inject) ?? transform
        };
    }

    transpile(src: string, filename?: string): Promise<Output> {
        const opt: Options = structuredClone(this.#swcSettings);
        if (typeof filename === 'string') { opt.filename = filename; }

        return this.#injected.transform(src);
    }
}