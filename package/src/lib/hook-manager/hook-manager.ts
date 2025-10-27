import type { LoadFnOutput, LoadHookContext, ResolveFnOutput, ResolveHookContext } from 'module';
import type { Config as SWCConfig } from '@swc/core';
import type { TSConfig } from '@lib/ts-config/index.js';

import { SpecifierMatcher } from '@lib/specifier-matcher/index.js';
import { toSWCConfig } from '@lib/ts-config/index.js';

type DefaultLoad = (
    url: string,
    context?: LoadHookContext
) => LoadFnOutput | Promise<LoadFnOutput>;

type DefaultResolve = (
    specifier: string,
    context?: ResolveHookContext
) => ResolveFnOutput | Promise<ResolveFnOutput>;

export class HookManager {
    #matcher: SpecifierMatcher;
    #tsConfig: TSConfig;
    #swcConfig: SWCConfig;

    constructor(tsConfig: TSConfig) {
        this.#matcher = new SpecifierMatcher(tsConfig);
        this.#tsConfig = tsConfig;
        this.#swcConfig = toSWCConfig(tsConfig);
    }

    async resolve(
        specifier: string,
        context: ResolveHookContext,
        defaultResolve: DefaultResolve
    ): Promise<ResolveFnOutput> {
        const newSpecifier = await this.#matcher.find(specifier, context);
        return defaultResolve(newSpecifier, context);
    }

    async load(
        url: string,
        context: LoadHookContext,
        defaultLoad: DefaultLoad
    ): Promise<LoadFnOutput> {
        return defaultLoad(url, context);
    }
}