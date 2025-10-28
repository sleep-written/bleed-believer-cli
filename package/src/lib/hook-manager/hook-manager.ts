import type { LoadFnOutput, LoadHookContext, ResolveFnOutput, ResolveHookContext } from 'module';
import type { Config as SWCConfig } from '@swc/core';
import type { TSConfig } from '@lib/ts-config/index.js';

import { SpecifierMatcher } from '@lib/specifier-matcher/index.js';
import { toSWCConfig } from '@lib/ts-config/index.js';
import { transform } from '@swc/core';
import { resolve } from 'path';

type DefaultLoad = (
    url: string,
    context?: LoadHookContext
) => LoadFnOutput | Promise<LoadFnOutput>;

type DefaultResolve = (
    specifier: string,
    context?: ResolveHookContext
) => ResolveFnOutput | Promise<ResolveFnOutput>;

export class HookManager {
    #swcConfig: SWCConfig;
    #matcher: SpecifierMatcher;

    constructor(tsConfig: TSConfig) {
        this.#swcConfig = toSWCConfig(tsConfig);
        this.#matcher = new SpecifierMatcher(tsConfig);

        if (typeof this.#swcConfig?.jsc?.baseUrl === 'string') {
            this.#swcConfig.jsc.baseUrl = resolve(this.#swcConfig.jsc.baseUrl);
        }
    }

    async resolve(
        specifier: string,
        context: ResolveHookContext,
        defaultResolve: DefaultResolve
    ): Promise<ResolveFnOutput> {
        try {
            const result = await defaultResolve(specifier, context);
            result.shortCircuit = true;
            return result;
        } catch {
            const newSpecifier = await this.#matcher.find(specifier, context);
            return defaultResolve(newSpecifier, context);
        }
    }

    async load(
        url: string,
        context: LoadHookContext,
        defaultLoad: DefaultLoad
    ): Promise<LoadFnOutput> {
        if (/\.m?ts$/.test(url)) {
            const fileContentTs = await defaultLoad(url, context);
            const fileContentJs = await transform(
                (fileContentTs.source as Buffer).toString('utf-8'),
                this.#swcConfig
            );

            return {
                format: context.format,
                source: fileContentJs.code,
                shortCircuit: true
            };

        }

        if (context.format === 'json') {
            if (!context.importAttributes) {
                context.importAttributes = { type: 'json' };
            } else {
                context.importAttributes.type = 'json';
            }
        }
        
        return defaultLoad(url, context);
    }
}