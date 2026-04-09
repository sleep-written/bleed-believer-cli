import type { TargetFileInject, TsconfigObject } from './interfaces/index.ts';

import { basename, dirname, isAbsolute, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { accessSync } from 'node:fs';

export class TargetFile {
    static toTs(input: string): string {
        return input.replace(
            /(?<=\.(?:m|c)?)j(?=sx?$)/i,
            v => v === v.toUpperCase()
            ?   'T'
            :   't'
        );
    }

    static toJs(input: string): string {
        return input.replace(
            /(?<=\.(?:m|c)?)t(?=sx?$)/i,
            v => v === v.toUpperCase()
            ?   'J'
            :   'j'
        );
    }

    #tsconfig: TsconfigObject;
    #injected: Required<TargetFileInject>;
    #rootDir?: string;
    #outDir?: string;
    #path: string;

    get basename(): string {
        return this.#injected.basename(this.#path);
    }

    get dirname(): string {
        return this.#injected.dirname(this.#path);
    }

    get isTs(): boolean {
        return /\.(?:c|m)?tsx?$/i.test(this.#path);
    }

    get isJs(): boolean {
        return /\.(?:c|m)?jsx?$/i.test(this.#path);
    }

    get href(): string {
        return this.#injected.pathToFileURL(this.#path).href;
    }

    get exists(): boolean {
        try {
            this.#injected.accessSync(this.#path);
            return true;
        } catch {
            return false;
        }
    }

    constructor(pathOrFileURL: string, tsconfig: TsconfigObject, inject?: TargetFileInject) {
        this.#tsconfig = tsconfig;
        this.#injected = {
            sep:            inject?.sep ?? sep,
            dirname:        inject?.dirname?.bind(inject)       ?? dirname,
            resolve:        inject?.resolve?.bind(inject)       ?? resolve,
            basename:       inject?.basename?.bind(inject)      ?? basename,
            accessSync:     inject?.accessSync?.bind(inject)    ?? accessSync,
            isAbsolute:     inject?.isAbsolute?.bind(inject)    ?? isAbsolute,
            fileURLToPath:  inject?.fileURLToPath?.bind(inject) ?? fileURLToPath,
            pathToFileURL:  inject?.pathToFileURL?.bind(inject) ?? pathToFileURL,
        };

        const cwd = this.#injected.dirname(this.#tsconfig.path);
        const outDir = this.#tsconfig.options.outDir;
        if (typeof outDir === 'string') {
            const path = !this.#injected.isAbsolute(outDir)
            ?   this.#injected.resolve(cwd, outDir)
            :   outDir;

            this.#outDir = path + this.#injected.sep;
        }

        const rootDir = this.#tsconfig.options.rootDir;
        if (typeof rootDir === 'string') {
            const path = !this.#injected.isAbsolute(rootDir)
            ?   this.#injected.resolve(cwd, rootDir)
            :   rootDir;

            this.#rootDir = path + this.#injected.sep;
        }

        this.#path = pathOrFileURL.startsWith('file://')
        ?   this.#injected.fileURLToPath(pathOrFileURL)
        :   this.#injected.resolve(pathOrFileURL);
    }

    toTs(): TargetFile {
        return new TargetFile(
            TargetFile.toTs(this.#path),
            this.#tsconfig,
            this.#injected
        );
    }

    toJs(): TargetFile {
        let path = this.#path;
        if (
            typeof this.#outDir === 'string' &&
            typeof this.#rootDir === 'string' &&
            path.startsWith(this.#rootDir)
        ) {
            path = this.#injected.resolve(
                this.#outDir,
                path.slice(this.#rootDir.length)
            );
        }

        return new TargetFile(
            TargetFile.toJs(path),
            this.#tsconfig,
            this.#injected
        );
    }

    toString(): string {
        return this.#path;
    }
}