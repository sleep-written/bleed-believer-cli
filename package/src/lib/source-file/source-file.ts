import type { SourceFileInject } from './interfaces/index.ts';

import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve, sep } from 'node:path';
import { access, readFile } from 'node:fs/promises';
import { accessSync } from 'node:fs';

export class SourceFile {
    static toTsExt(specifier: string): string {
        return specifier.replace(
            /(?<=\.(?:m|c)?)j(?=sx?$)/i,
            v => v === v.toUpperCase()
            ?   'T'
            :   't'
        );
    }

    static toJsExt(specifier: string): string {
        return specifier.replace(
            /(?<=\.(?:m|c)?)t(?=sx?$)/i,
            v => v === v.toUpperCase()
            ?   'J'
            :   'j'
        );
    }

    #injected: Required<SourceFileInject>;
    #path: string;
    get path(): string {
        return this.#path;
    }

    #dirname?: string;
    get dirname(): string {
        if (typeof this.#dirname !== 'string') {
            this.#dirname = this.#injected.dirname(this.#path);
        }

        return this.#dirname;
    }

    #url?: URL;
    get url(): URL {
        if (!this.#url) {
            this.#url = pathToFileURL(this.#path);
        }

        return this.#url;
    }

    get isTs(): boolean {
        return /\.(?:c|m)?tsx?$/i.test(this.#path);
    }

    get isJs(): boolean {
        return /\.(?:c|m)?jsx?$/i.test(this.#path);
    }

    constructor(pathOrFileURL: string, inject?: SourceFileInject) {
        this.#injected = {
            accessSync: inject?.accessSync?.bind(inject)    ?? accessSync,
            readFile:   inject?.readFile?.bind(inject)      ?? readFile,
            dirname:    inject?.dirname?.bind(inject)       ?? dirname,
            resolve:    inject?.resolve?.bind(inject)       ?? resolve,
            access:     inject?.access?.bind(inject)        ?? access,
            sep:        inject?.sep                         ?? sep,
        };

        this.#path = /^file:\/{2}/.test(pathOrFileURL)
        ?   fileURLToPath(pathOrFileURL)
        :   this.#injected.resolve(pathOrFileURL);
    }

    async exists(): Promise<boolean> {
        try {
            await this.#injected.access(this.#path);
            return true;
        } catch {
            return false;
        }
    }

    existsSync(): boolean {
        try {
            this.#injected.accessSync(this.#path);
            return true;
        } catch {
            return false;
        }
    }

    toTsExt(): SourceFile {
        const path = SourceFile.toTsExt(this.#path);
        return new SourceFile(path, this.#injected);
    }

    toJsExt(): SourceFile {
        const path = SourceFile.toJsExt(this.#path);
        return new SourceFile(path, this.#injected);
    }

    readFile(): Promise<string> {
        return this.#injected.readFile(this.#path, 'utf-8');
    }
}