import type { LoadFnOutput, LoadHook, LoadHookContext } from 'node:module';
import type { TsconfigObject, TranspilerInject } from './interfaces/index.ts';
import type { Config, Options, Output } from '@swc/core';

import { tsconfigToSwcrc } from './tsconfig-to-swcrc.ts';
import { transform } from '@swc/core';

export class LoadCustomHook {
    #swcSettings: Config;
    #injected: Required<TranspilerInject>;

    constructor(tsconfig: TsconfigObject, inject?: TranspilerInject) {
        this.#swcSettings = tsconfigToSwcrc(tsconfig);
        this.#injected = {
            transform:  inject?.transform?.bind(inject) ?? transform
        };
    }

    async load(
        url: string,
        context: LoadHookContext,
        defaultLoad: Parameters<LoadHook>[2]
    ): Promise<LoadFnOutput> {
        return defaultLoad(url, context);
    }
}