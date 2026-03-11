import type { CompilerOptions, TsconfigLoadInject } from './interfaces/index.ts';

import { parseCompilerOptions } from './parse-compiler-options.ts';
import { dirname, isAbsolute, resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import json5 from 'json5';

export class Tsconfig {
    static async load(
        path: string,
        inject?: TsconfigLoadInject
    ): Promise<Tsconfig> {
        const injected: Required<TsconfigLoadInject> = {
            isAbsolute: inject?.isAbsolute?.bind(inject)    ?? isAbsolute,
            readFile:   inject?.readFile?.bind(inject)      ?? readFile,
            resolve:    inject?.resolve?.bind(inject)       ?? resolve,
            process:    inject?.process ?? process
        }

        const cwd = injected.process.cwd()
        if (!injected.isAbsolute(path)) {
            path = injected.resolve(cwd, path);
        }

        if (!/\.json$/i.test(path)) {
            path = injected.resolve(path, 'tsconfig.json');
        }

        const tsconfig = new Tsconfig(path);
        const text = await injected.readFile(path, 'utf-8');
        const json = json5.parse(text);

        if (typeof json.extends === 'string') {
            json.extends = [ json.extends ];
        }

        if (json.extends instanceof Array) {
            tsconfig.#extends = [];
            for (const innerPath of json.extends) {
                const innerFullPath = injected.resolve(cwd, dirname(path), innerPath);
                const innerTsconfig = await Tsconfig.load(innerFullPath, inject);
                tsconfig.#extends.push(innerTsconfig);
            }
        }

        if (json.compilerOptions) {
            tsconfig.#compilerOptions = parseCompilerOptions(json.compilerOptions);
        }

        if (json.include instanceof Array) {
            tsconfig.#include = json.include.filter((x: any) => typeof x === 'string');
        }
        
        if (json.exclude instanceof Array) {
            tsconfig.#exclude = json.exclude.filter((x: any) => typeof x === 'string');
        }

        return tsconfig;
    }

    #path: string;
    get path(): string {
        return this.#path;
    }

    #extends?: Tsconfig[];
    get extends(): Tsconfig[] | undefined {
        return this.#extends;
    }

    #include?: string[];
    get include(): string[] | undefined {
        return this.#include;
    }

    #exclude?: string[];
    get exclude(): string[] | undefined {
        return this.#exclude;
    }

    #compilerOptions?: CompilerOptions;
    get compilerOptions(): CompilerOptions | undefined {
        return this.#compilerOptions;
    }

    constructor(path: string) {
        this.#path = path;
    }
}