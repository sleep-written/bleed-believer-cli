import type { LoadFnOutput, LoadHook, LoadHookContext } from 'node:module';
import type { TsconfigObject } from './interfaces/index.ts';
import type { Options } from '@swc/core';

import { fileURLToPath } from 'node:url';
import { transform } from '@swc/core';
import { readFile } from 'node:fs/promises';

export class LoadCustomHook {
    #swcSettings: Options;
    #cache = new Map<string, string>();

    constructor(tsconfig: TsconfigObject) {
        this.#swcSettings = tsconfig.toSwcConfig();
    }

    async load(
        url: string,
        context: LoadHookContext,
        defaultLoad: Parameters<LoadHook>[2]
    ): Promise<LoadFnOutput> {
        switch (context.format) {
            case 'module-typescript': {
                if (this.#cache.has(url)) {
                    return {
                        shortCircuit: true,
                        format: 'module',
                        source: this.#cache.get(url),
                    };
                }

                const path = fileURLToPath(url);
                const text = await readFile(path, 'utf-8');
                const conf = structuredClone(this.#swcSettings);
                conf.sourceFileName = path;
                conf.filename = path;
                if (conf.sourceMaps) {
                    conf.sourceMaps = 'inline';
                }

                const { code } = await transform(text, conf);
                this.#cache.set(url, code);
                return {
                    shortCircuit: true,
                    format: 'module',
                    source: code,
                };
            }

            default: {
                return defaultLoad(url, context);
            }
        }
    }
}