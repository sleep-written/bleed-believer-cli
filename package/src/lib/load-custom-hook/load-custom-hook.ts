import type { LoadFnOutput, LoadHook, LoadHookContext } from 'node:module';
import type { TsconfigObject } from './interfaces/index.ts';
import type { Options } from '@swc/core';

import { fileURLToPath } from 'node:url';
import { transform } from '@swc/core';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

export class LoadCustomHook {
    #swcSettings: Options;
    #cache = new Map<string, string>();
    #cwd: string;

    constructor(tsconfig: TsconfigObject) {
        this.#swcSettings = tsconfig.toSwcConfig();
        this.#cwd = dirname(tsconfig.path);
    }

    async load(
        url: string,
        context: LoadHookContext,
        defaultLoad: Parameters<LoadHook>[2]
    ): Promise<LoadFnOutput> {
        if (this.#cache.has(url)) {
            return {
                shortCircuit: true,
                format: 'module',
                source: this.#cache.get(url),
            };
        }

        if (
            /\.m?tsx?$/i.test(url) ||
            context.format === 'module-typescript'
        ) {
            const path = fileURLToPath(url);
            const text = await readFile(path, 'utf-8');
            const conf = structuredClone(this.#swcSettings);
            conf.sourceFileName = path;
            conf.filename = path;
            if (conf.sourceMaps) {
                conf.sourceMaps = 'inline';
            }

            if (typeof conf.jsc?.baseUrl === 'string') {
                conf.jsc.baseUrl = resolve(
                    this.#cwd,
                    conf.jsc.baseUrl
                );
            }

            const { code } = await transform(text, conf);
            this.#cache.set(url, code);
            return {
                shortCircuit: true,
                format: 'module',
                source: code,
            };
        }
        
        return defaultLoad(url, context);
    }
}