import type { SpecifierMatcherInject, ResolveHookContext } from './interfaces/index.js';
import type { TSConfig } from '@lib/ts-config/index.js';

import { dirname, resolve, sep } from 'path';
import { replaceFromStart } from './replace-from-start.js';
import { fileURLToPath } from 'url';
import { PathAlias } from '@lib/path-alias/index.js';
import { access } from 'fs/promises';

export class SpecifierMatcher {
    #pathAlias: PathAlias;
    #rootDir: string;
    #outDir: string;
    #inject: Required<SpecifierMatcherInject>;
    #cache = new Map<string, string>();

    constructor(tsConfig: TSConfig, inject?: SpecifierMatcherInject) {
        this.#pathAlias = new PathAlias(tsConfig, inject);
        this.#inject = {
            process: inject?.process ?? process,
            access:  inject?.access  ?? access
        };

        const cwd = this.#inject.process.cwd();
        this.#rootDir = resolve(cwd, tsConfig?.compilerOptions?.rootDir ?? '.') + sep;
        this.#outDir =  resolve(cwd, tsConfig?.compilerOptions?.outDir  ?? '.') + sep;
    }

    async #exists(path: string): Promise<boolean> {
        try {
            await this.#inject.access(path);
            return true;
        } catch {
            return false;
        }
    }

    async find(specifier: string, context: ResolveHookContext): Promise<string> {
        if (typeof context.parentURL !== 'string') {
            return specifier;
        }

        if (this.#cache.has(specifier)) {
            return this.#cache.get(specifier)!;
        }

        const parentDir = dirname(fileURLToPath(context.parentURL));
        const paths = this.#pathAlias.find(specifier) ?? [];
        for (let path of paths) {
            if (parentDir.startsWith(this.#rootDir)) {
                path = path.replace(/(?<=\.)j(?=s$)/i, 't');
                if (await this.#exists(path)) {
                    this.#cache.set(specifier, path);
                    return path;
                }

            } else if (parentDir.startsWith(this.#outDir)) {
                path = replaceFromStart(path, this.#rootDir, this.#outDir)
                    .replace(/(?<=\.)t(?=s$)/i, 'j');

                if (await this.#exists(path)) {
                    this.#cache.set(specifier, path);
                    return path;
                }
            }
        }

        return specifier;
    }
}