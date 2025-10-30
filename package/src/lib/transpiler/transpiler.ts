import type { TranspilerInject } from './interfaces/index.js';
import type { TSConfig } from '@lib/ts-config/ts-config.js';
import type { Config, Options } from '@swc/core';

import { readFile, writeFile } from 'fs/promises';
import { transform } from '@swc/core';
import { logger } from '@/logger.js';
import { resolve } from 'path';
import type { Dirent } from 'fs';

export class Transpiler {
    #config: Config;
    #inject: Required<TranspilerInject>;

    #cwd: string;
    #outDir: string;
    #rootDir: string;

    constructor(tsConfig: TSConfig, inject?: TranspilerInject) {
        this.#config = tsConfig.toSWC();
        this.#inject = {
            logger:     inject?.logger      ?? logger,
            process:    inject?.process     ?? process,
            readFile:   inject?.readFile    ?? readFile,
            writeFile:  inject?.writeFile   ?? writeFile,
            transform:  inject?.transform   ?? transform
        };

        this.#cwd = this.#inject.process.cwd();
        this.#outDir = resolve(tsConfig.value?.compilerOptions?.outDir ?? '.');
        this.#rootDir = resolve(tsConfig.value?.compilerOptions?.rootDir ?? '.');
    }

    #outputPaths(file: { name: string; parentPath: string }): { code: string; map: string; } {
        const parent = file.parentPath.slice(this.#rootDir.length + 1);
        const source = resolve(
            this.#outDir,
            parent,
            file.name
        );

        const code = source.replace(/(?<=\.m?)t(?=s$)/i, 'j');
        const map = code + '.map';
        return { code, map };
    }

    async transpile(file: { name: string; parentPath: string }): Promise<void> {
        const options: Options = structuredClone(this.#config);
        options.filename = resolve(file.parentPath, file.name);

        const paths = this.#outputPaths(file);
        const source = await this.#inject.readFile(options.filename, 'utf-8');
        const output = await this.#inject.transform(source, options);

        await this.#inject.writeFile(paths.code, output.code, 'utf-8');
        if (output.map) {
            await this.#inject.writeFile(paths.map, output.map, 'utf-8');
        }
    }
}