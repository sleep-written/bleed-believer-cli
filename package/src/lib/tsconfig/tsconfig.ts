import type { TsconfigJSON, TsconfigInject } from './interfaces/index.ts';
import type { Config } from '@swc/core';

import { dirname, isAbsolute, resolve } from 'node:path';
import { isBuiltin } from 'node:module';

import { loadTsconfigJSON } from './load-tsconfig-json.ts';
import { tsconfigToSwcrc } from './tsconfig-to-swcrc.ts';

export class Tsconfig {
    static async load(path: string): Promise<Tsconfig> {
        const out = await loadTsconfigJSON(path);
        return new Tsconfig(path, out);
    }

    #injected: Required<TsconfigInject>;

    #path: string;
    get path(): string {
        return this.#path;
    }

    #json: TsconfigJSON;
    get json(): TsconfigJSON {
        return this.#json;
    }

    constructor(
        path: string,
        json: TsconfigJSON,
        inject?: TsconfigInject
    ) {
        this.#path = path;
        this.#json = json;
        this.#injected = {
            dirname:    inject?.dirname?.bind(inject)       ?? dirname,
            resolve:    inject?.resolve?.bind(inject)       ?? resolve,
            isAbsolute: inject?.isAbsolute?.bind(inject)    ?? isAbsolute,
        };
    }

    resolve(specifier: string): string[] | null {
        if (isBuiltin(specifier)) {
            return null;
        }

        const paths = this.#json.compilerOptions?.paths;
        if (!paths) {
            return null;
        }

        const basePath = this.#injected.resolve(
            this.#injected.dirname(this.#path),
            this.#json.compilerOptions?.baseUrl ?? '.'
        );

        for (const [ k, v ] of Object.entries(paths)) {
            const testPattern = new RegExp(
                k
                    .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
                    .replace(/\\\*/g, '.+')
                    .replace(/^/, '^')
                    .replace(/$/, '$')
            );

            if (testPattern.test(specifier)) {
                const replacePattern = new RegExp(
                    k
                        .replace(/\*.*$/, '')
                        .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
                        .replace(/^/, '^')
                );

                return v.map(path => this.#injected.resolve(
                        basePath,
                        specifier.replace(
                            replacePattern,
                            path.replace(/\*/, '')
                        )
                    )
                )
            }
        }

        return null;
    }

    toSwcConfig(): Config {
        const config = tsconfigToSwcrc(this.#json);
        if (
            typeof config.jsc &&
            config.jsc?.baseUrl === 'string' &&
            !this.#injected.isAbsolute(config.jsc.baseUrl)
        ) {
            config.jsc.baseUrl = this.#injected.resolve(
                this.#injected.dirname(this.#path),
                config.jsc.baseUrl
            )
        }

        return config;
    }
}