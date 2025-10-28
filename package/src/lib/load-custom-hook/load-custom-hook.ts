import type { DefaultLoad, LoadCustomHookInject } from './interfaces/index.js';
import type { LoadFnOutput, LoadHookContext } from 'module';
import type { Config as SWCConfig } from '@swc/core';
import type { TSConfig } from '@lib/ts-config/index.js';

import { toSWCConfig } from '@lib/ts-config/index.js';
import { transform } from '@swc/core';
import { resolve } from 'path';

export class LoadCustomHook {
    #swcConfig: SWCConfig;
    #inject: Required<LoadCustomHookInject>;

    constructor(tsConfig: TSConfig, inject?: LoadCustomHookInject) {
        this.#swcConfig = toSWCConfig(tsConfig);
        this.#inject = {
            process:    inject?.process ?? process,
            transform:  inject?.transform ?? transform
        };

        if (typeof this.#swcConfig.jsc?.baseUrl === 'string') {
            this.#swcConfig.jsc.baseUrl = resolve(
                this.#inject.process.cwd(),
                this.#swcConfig.jsc.baseUrl
            );
        }
    }

    async load(url: string, context: LoadHookContext, defaultLoad: DefaultLoad): Promise<LoadFnOutput> {
        if (/\.m?ts$/.test(url)) {
            const fileContentTs = await defaultLoad(url, context);
            const fileContentJs = await this.#inject.transform(
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