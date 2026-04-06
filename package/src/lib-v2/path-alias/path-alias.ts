import { fileURLToPath, pathToFileURL } from 'node:url';
import type { TsconfigObject, PathAliasInject } from './interfaces/index.ts';
import { dirname, relative, resolve, sep } from 'node:path';
import { isBuiltin } from 'node:module';
import { accessSync } from 'node:fs';

export class PathAlias {
    static #toTsExt(specifier: string): string {
        return specifier.replace(
            /(?<=\.(?:m|c)?)j(?=sx?$)/i,
            v => v === v.toUpperCase()
            ?   'T'
            :   't'
        );
    }

    static #toJsExt(specifier: string): string {
        return specifier.replace(
            /(?<=\.(?:m|c)?)t(?=sx?$)/i,
            v => v === v.toUpperCase()
            ?   'J'
            :   'j'
        );
    }

    #cwd: string;
    #aliases = new Map<RegExp, string[]>();
    #outDir: string;
    #rootDir: string;
    #injected: Required<PathAliasInject>;

    constructor(tsconfig: TsconfigObject, inject?: PathAliasInject) {
        this.#injected = {
            fileURLToPath:  inject?.fileURLToPath?.bind(inject) ??  fileURLToPath,
            pathToFileURL:  inject?.pathToFileURL?.bind(inject) ??  pathToFileURL,
            accessSync:     inject?.accessSync?.bind(inject)    ??  accessSync,
            relative:       inject?.relative?.bind(inject)      ??  relative,
            dirname:        inject?.dirname?.bind(inject)       ??  dirname,
            resolve:        inject?.resolve?.bind(inject)       ??  resolve,
            sep:            inject?.sep                         ??  sep
        };

        this.#cwd = this.#injected.resolve(tsconfig.path, '..');
        this.#outDir = this.#injected.resolve(
            this.#cwd,
            tsconfig.options.outDir ?? '.'
        );

        this.#rootDir = this.#injected.resolve(
            this.#cwd,
            tsconfig.options.rootDir ?? '.'
        );

        Object
            .entries(tsconfig.options.paths ?? {})
            .forEach(([ alias, paths ]) => {
                const pattern = RegExp
                    .escape(alias)
                    .replace(/\\\*/g, '(.+)');

                this.#aliases.set(
                    new RegExp(`^${pattern}$`),
                    paths.map(x => this.#injected.resolve(this.#cwd, x))
                );
            });
    }

    resolve(specifier: string, parentPathOrURL?: string) {
        const parentPath = parentPathOrURL?.startsWith('file://')
        ?   this.#injected.fileURLToPath(parentPathOrURL)
        :   parentPathOrURL;

        if (isBuiltin(specifier)) {
            return specifier;
        }

        for (const [ regExp, paths ] of this.#aliases) {
            const parts = regExp.exec(specifier)?.slice(1);
            if (!parts) {
                continue;
            }

            for (let path of paths) {
                try {
                    path = PathAlias.#toTsExt(path);
                    parts.forEach(x => { path = path.replace('*', x) });
                    this.#injected.accessSync(path);

                    return typeof parentPath === 'string'
                    ?   `.${this.#injected.sep}` + this.#injected.relative(this.#injected.dirname(parentPath), path)
                    :   this.#injected.pathToFileURL(path).href;

                } catch {
                    continue;

                }
            }
        }

        return specifier;
    }
}