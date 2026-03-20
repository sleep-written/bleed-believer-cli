import type { LoadFnOutput, LoadHook, LoadHookContext } from 'node:module';
import type { TsconfigObject } from './interfaces/index.ts';
import type { Config } from '@swc/core';

export class LoadCustomHook {
    #swcSettings: Config;

    constructor(tsconfig: TsconfigObject) {
        this.#swcSettings = tsconfig.toSwcConfig();
    }

    async load(
        url: string,
        context: LoadHookContext,
        defaultLoad: Parameters<LoadHook>[2]
    ): Promise<LoadFnOutput> {
        console.log('url:', url);
        console.log('ctx:', context);
        console.log();
        return defaultLoad(url, context);
    }
}