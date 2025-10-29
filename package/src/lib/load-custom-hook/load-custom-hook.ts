import type { DefaultLoad, LoadCustomHookInject } from './interfaces/index.js';
import type { LoadFnOutput, LoadHookContext } from 'module';
import type { Options } from '@swc/core';

import { fileURLToPath } from 'url';
import { transform } from '@swc/core';
import { TSConfig } from '@lib/ts-config/index.js';

export class LoadCustomHook {
    #swcOptions: Options;
    #inject: Required<LoadCustomHookInject>;

    constructor(tsConfig: TSConfig, inject?: LoadCustomHookInject) {
        this.#inject = {
            process:    inject?.process ?? process,
            transform:  inject?.transform ?? transform
        };

        this.#swcOptions = tsConfig.toSWC();
        if (this.#swcOptions.sourceMaps) {
            this.#swcOptions.sourceMaps = 'inline';
            this.#swcOptions.inlineSourcesContent = false;
        }
    }

    async load(url: string, context: LoadHookContext, defaultLoad: DefaultLoad): Promise<LoadFnOutput> {
        if (/\.m?ts$/.test(url)) {
            const swcOptions = structuredClone(this.#swcOptions);
            swcOptions.sourceFileName = fileURLToPath(url);

            const fileContentTs = await defaultLoad(url, context);
            const fileContentJs = await this.#inject.transform(
                (fileContentTs.source as Buffer).toString('utf-8'),
                swcOptions
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