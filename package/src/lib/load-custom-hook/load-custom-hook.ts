import type { DefaultLoad, LoadCustomHookInject } from './interfaces/index.js';
import type { LoadFnOutput, LoadHookContext } from 'module';
import type { Config } from '@swc/core';

import { transform } from '@swc/core';
import { TSConfig } from '@lib/ts-config/index.js';

export class LoadCustomHook {
    #swcConfig: Config;
    #inject: Required<LoadCustomHookInject>;

    constructor(tsConfig: TSConfig, inject?: LoadCustomHookInject) {
        this.#swcConfig = tsConfig.toSWC();
        this.#inject = {
            process:    inject?.process ?? process,
            transform:  inject?.transform ?? transform
        };
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