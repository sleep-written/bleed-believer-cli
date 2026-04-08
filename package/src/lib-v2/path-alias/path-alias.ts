import type { TsconfigObject, PathAliasInject, TargetFileObject } from './interfaces/index.ts';

import { TargetFile } from '../target-file/index.ts';

import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { accessSync } from 'node:fs';
import { isBuiltin } from 'node:module';

export class PathAlias {
    #injected: Required<PathAliasInject>;
    #tsconfig: TsconfigObject;
    #aliases = new Map<RegExp, string[]>();

    #toOutDir: boolean;
    get toOutDir(): boolean {
        return this.#toOutDir;
    }

    constructor(tsconfig: TsconfigObject, toOutDir?: boolean, inject?: PathAliasInject) {
        this.#toOutDir = !!toOutDir;
        this.#injected = {
            fileURLToPath:  inject?.fileURLToPath?.bind(inject) ??  fileURLToPath,
            pathToFileURL:  inject?.pathToFileURL?.bind(inject) ??  pathToFileURL,
            accessSync:     inject?.accessSync?.bind(inject)    ??  accessSync,
            isAbsolute:     inject?.isAbsolute?.bind(inject)    ??  isAbsolute,
            relative:       inject?.relative?.bind(inject)      ??  relative,
            dirname:        inject?.dirname?.bind(inject)       ??  dirname,
            resolve:        inject?.resolve?.bind(inject)       ??  resolve,

            targetFile:     inject?.targetFile  ??  TargetFile,
            sep:            inject?.sep         ??  sep
        };

        const cwd = this.#injected.dirname(tsconfig.path);
        let baseUrl = tsconfig.options.baseUrl;
        if (typeof baseUrl === 'string' && !this.#injected.isAbsolute(baseUrl)) {
            baseUrl = this.#injected.resolve(cwd, baseUrl);
        }

        this.#tsconfig = tsconfig;
        Object
            .entries(tsconfig.options.paths ?? {})
            .forEach(([ alias, paths ]) => {
                const pattern = RegExp
                    .escape(alias)
                    .replace(/\\\*/g, '(.+)');

                const path = baseUrl ?? cwd;
                this.#aliases.set(
                    new RegExp(`^${pattern}$`),
                    paths.map(x => this.#injected.resolve(path, x))
                );
            });
    }

    #newTargetFile(pathOrFileURL: string): TargetFileObject {
        return new this.#injected.targetFile(
            pathOrFileURL,
            this.#tsconfig,
            this.#injected
        );
    }

    resolve(specifier: string, pathOrFileURL: string): string {
        if (isBuiltin(specifier)) {
            return specifier;
        }

        const file = this.#newTargetFile(pathOrFileURL);
        for (const [ regExp, paths ] of this.#aliases) {
            const parts = regExp.exec(specifier)?.slice(1);
            if (!parts) {
                continue;
            }

            for (let path of paths) {
                parts.forEach(x => { path = path.replace('*', x); });
                const targetTsFile = this.#newTargetFile(path).toTs();
                

                if (file.isTs && !this.#toOutDir && targetTsFile.exists) {
                    const value = this.#injected.relative(
                        file.dirname,
                        targetTsFile.toString()
                    );

                    return `.${this.#injected.sep}${value}`;
                }

                const targetJsFile = targetTsFile.toJs();
                if (file.isJs && targetJsFile.exists) {
                    const value = this.#injected.relative(
                        file.dirname,
                        targetJsFile.toString()
                    );

                    return `.${this.#injected.sep}${value}`;
                }
            }
        }

        return specifier;
    }
}