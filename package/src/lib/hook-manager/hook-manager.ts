import type { LoadFnOutput, LoadHookContext, ResolveFnOutput, ResolveHookContext } from 'module';
import type { Config as SWCConfig } from '@swc/core';
import type { TSConfig } from '@lib/ts-config/index.js';

import { toSWCConfig } from '@lib/ts-config/index.js';
import { PathAlias } from '@lib/path-alias/index.js';

type DefaultLoad = (
    url: string,
    context?: LoadHookContext
) => LoadFnOutput | Promise<LoadFnOutput>;

type DefaultResolve = (
    specifier: string,
    context?: ResolveHookContext
) => ResolveFnOutput | Promise<ResolveFnOutput>;

export class HookManager {
    #tsConfig: TSConfig;
    #swcConfig: SWCConfig;
    #pathAlias: PathAlias;

    constructor(tsConfig: TSConfig) {
        this.#tsConfig = tsConfig;
        this.#pathAlias = new PathAlias(tsConfig);
        this.#swcConfig = toSWCConfig(tsConfig);
    }

    async resolve(
        specifier: string,
        context: ResolveHookContext,
        defaultResolve: DefaultResolve
    ): Promise<ResolveFnOutput> {
        
        return defaultResolve(specifier, context);
    }

    async load(
        url: string,
        context: LoadHookContext,
        defaultLoad: DefaultLoad
    ): Promise<LoadFnOutput> {
        return defaultLoad(url, context);
    }
}