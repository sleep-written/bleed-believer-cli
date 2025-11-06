import type { FileTranspilerInject, TranspilerInject } from './interfaces/index.js';
import type { TSConfig } from '@lib/ts-config/index.js';
import type { Dirent } from 'fs';

import { FileTranspiler } from './file-transpiler.js';
import { join, resolve } from 'path';
import { logger } from '@/logger.js';
import { glob } from 'fs/promises';

export class Transpiler {
    #tsConfig: TSConfig;
    #inject: Required<TranspilerInject>;

    constructor(tsConfig: TSConfig, inject?: TranspilerInject) {
        this.#tsConfig = tsConfig;
        this.#inject = {
            logger: inject?.logger ?? logger
        }
    }

    async #getSourceFiles(tsConfig: TSConfig): Promise<Dirent<string>[]> {
        const sourcePath = resolve(
            tsConfig.value.compilerOptions?.rootDir ?? '.',
            './**/*.{ts,mts}'
        );

        const dirents = glob(sourcePath, {
            exclude: tsConfig.value.exclude,
            withFileTypes: true
        });
    
        const files: Dirent<string>[] = [];
        for await (const dirent of dirents) {
            if (dirent.isFile()) {
                files.push(dirent);
            }
        }

        return files;
    }

    async build(inject?: FileTranspilerInject): Promise<void> {
        const fileTranspiler = new FileTranspiler(this.#tsConfig, inject);
        const files = await this.#getSourceFiles(this.#tsConfig);
        const cwd = process.cwd();
        for (const file of files) {
            const path = join(
                file.parentPath.slice(cwd.length),
                file.name
            );

            this.#inject.logger.info(`Transpiling "${path}"`);
            await fileTranspiler.transpile(file);
        }
    }
}