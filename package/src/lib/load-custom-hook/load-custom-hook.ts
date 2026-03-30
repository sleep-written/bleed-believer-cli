import type { LoadFnOutput, LoadHook, LoadHookContext } from 'node:module';
import type { TsconfigObject } from './interfaces/index.ts';
import type { Options } from '@swc/core';

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from '@swc/core';
import { readFile } from 'node:fs/promises';

export class LoadCustomHook {
    #swcSettings: Options;
    #cache = new Map<string, LoadFnOutput>();
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
            return this.#cache.get(url)!;
        }

        if (/\.(?:m|c)?tsx?$/i.test(url)) {
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
            const format = context.format?.startsWith('module')
            ?   'module'
            :   context.format?.startsWith('commonjs')
            ?   'commonjs'
            :   context.format;

            const output: LoadFnOutput = {
                format,
                source: code,
                shortCircuit: true,
            };

            this.#cache.set(url, output);
            return output;
        }

        if (context.format === 'json') {
            context.importAttributes = {
                ...(context.importAttributes ?? {}),
                type: 'json'
            };
        }

        return defaultLoad(url, context);
    }
}