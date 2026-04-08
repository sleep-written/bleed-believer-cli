import type { TsconfigObject, PathAliasInject } from './interfaces/index.ts';

import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { accessSync } from 'node:fs';
import { isBuiltin } from 'node:module';

export class PathAlias {
    static #toJsExt(path: string): string {
        return path.replace(
            /(?<=\.(?:m|c)?)t(?=sx?$)/i,
            v => v === v.toUpperCase()
            ?   'J'
            :   'j'
        );
    }
    
    static #toTsExt(path: string): string {
        return path.replace(
            /(?<=\.(?:m|c)?)j(?=sx?$)/i,
            v => v === v.toUpperCase()
            ?   'T'
            :   't'
        );
    }

    #toJs: boolean;
    #paths = new Map<RegExp, string[]>;
    #injected: Required<PathAliasInject>;

    constructor(tsconfig: TsconfigObject, toJs: boolean, inject?: PathAliasInject) {
        this.#toJs      = toJs;
        this.#injected  = {
            fileURLToPath:  inject?.fileURLToPath?.bind(inject) ?? fileURLToPath,
            accessSync:     inject?.accessSync?.bind(inject)    ?? accessSync,
            relative:       inject?.relative?.bind(inject)      ?? relative,
            resolve:        inject?.resolve?.bind(inject)       ?? resolve,
            dirname:        inject?.dirname?.bind(inject)       ?? dirname,
            sep:            inject?.sep                         ?? sep,
        };
        
        const cwd       = this.#injected.dirname(tsconfig.path);
        const baseUrl   = this.#injected.resolve(cwd, tsconfig.options.baseUrl ?? '.');

        Object
            .entries(tsconfig.options.paths ?? {})
            .forEach(([ alias, paths ]) => {
                const pattern = RegExp
                    .escape(alias)
                    .replace(/\\\*/g, '(.+)');

                const path = baseUrl;
                this.#paths.set(
                    new RegExp(`^${pattern}$`),
                    paths.map(x => this.#injected.resolve(path, x))
                );
            });
    }

    #exists(path: string): boolean {
        try {
            this.#injected.accessSync(path);
            return true;
        } catch {
            return false;
        }
    }

    resolve(specifier: string, pathOrFileURL: string): string {
        if (isBuiltin(specifier)) {
            return specifier;
        }

        const filePath = pathOrFileURL.startsWith('file://')
        ?   this.#injected.fileURLToPath(pathOrFileURL)
        :   pathOrFileURL;

        for (const [ alias, paths ] of this.#paths) {
            const matches = alias.exec(specifier)?.slice(1);
            if (matches) {
                for (let path of paths) {
                    matches.forEach(x => path = path.replace('*', x));
                    path = PathAlias.#toTsExt(path);

                    if (this.#exists(path)) {
                        path = this.#injected.relative(
                            this.#injected.dirname(filePath),
                            path
                        );

                        if (this.#toJs) {
                            path = PathAlias.#toJsExt(path);
                        }

                        return `.${this.#injected.sep}${path}`;
                    }
                }
            }
        }

        let path = this.#injected.resolve(
            this.#injected.dirname(filePath),
            PathAlias.#toTsExt(specifier)
        );

        if (this.#exists(path)) {
            path = this.#injected.relative(
                this.#injected.dirname(filePath),
                path
            );

            if (this.#toJs) {
                path = PathAlias.#toJsExt(path);
            }

            return `.${this.#injected.sep}${path}`;
        }

        return specifier;
    }
}