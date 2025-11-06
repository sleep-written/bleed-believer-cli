import type { TranspilerInject } from './interfaces/index.js';
import type { Config, Options } from '@swc/core';
import type { TSConfig } from '@lib/ts-config/index.js';

import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, resolve } from 'path';
import { transform } from '@swc/core';

export class FileTranspiler {
    #config: Config;
    #inject: Required<TranspilerInject>;

    #outDir: string;
    #rootDir: string;

    constructor(tsConfig: TSConfig, inject?: TranspilerInject) {
        this.#config = tsConfig.toSWC();
        this.#inject = {
            process:    inject?.process                 ?? process,
            mkdir:      inject?.mkdir    ?.bind(inject) ?? mkdir,
            readFile:   inject?.readFile ?.bind(inject) ?? readFile,
            writeFile:  inject?.writeFile?.bind(inject) ?? writeFile,
            transform:  inject?.transform?.bind(inject) ?? transform
        };

        const cwd = this.#inject.process.cwd();
        this.#outDir = resolve(cwd, tsConfig.value?.compilerOptions?.outDir ?? '.');
        this.#rootDir = resolve(cwd, tsConfig.value?.compilerOptions?.rootDir ?? '.');
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

        const outputDir = dirname(paths.code);
        await this.#inject.mkdir(outputDir, { recursive: true });
        await this.#inject.writeFile(paths.code, output.code, 'utf-8');
        if (output.map) {
            const outputDirMap = dirname(paths.code);
            await this.#inject.mkdir(outputDirMap, { recursive: true });
            await this.#inject.writeFile(paths.map, output.map, 'utf-8');
        }
    }
}