import type { FileTranspilerInject, TranspilerInject } from './interfaces/index.js';
import type { Dirent, WatchOptions } from 'fs';
import type { TSConfig } from '@lib/ts-config/index.js';

import { FileTranspiler } from './file-transpiler.js';
import { join, resolve } from 'path';
import { logger } from '@/logger.js';
import { watch } from 'fs';
import { glob } from 'fs/promises';
import chalk from 'chalk';

export class Transpiler {
    #tsConfig: TSConfig;
    #inject: Required<TranspilerInject>;

    constructor(tsConfig: TSConfig, inject?: TranspilerInject) {
        this.#tsConfig = tsConfig;
        this.#inject = {
            logger:     inject?.logger  ?? logger,
            process:    inject?.process ?? process,
            watch:      inject?.watch   ?? watch
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
    
    async watch(inject?: FileTranspilerInject): Promise<void> {
        const tsConfig = this.#tsConfig.value;
        const rootDir = resolve(tsConfig.compilerOptions?.rootDir ?? '.');
        const options: WatchOptions = {};

        await this.build(inject);
        return new Promise<void>((resolve, reject) => {
            let task: Promise<void> | null = null;
            const watcher = this.#inject.watch(rootDir, options, () => {});

            watcher.once('close',  () => resolve());
            watcher.once('error',  er => reject(er));
            watcher.on('change', (e, name) => {
                // if (!/\.m?ts/.test(name)) {
                //     return;
                // }
                
                if (!task) {
                    console.log('event:', e);
                    console.log('file: ', name);
                    console.log();
                    task = this
                        .build(inject)
                        .then(() => { task = null })
                        .then(() => {
                            console.log();
                            console.log(chalk.blue('Waiting for file changes...'));
                        });
                }
            });

            this.#inject.process.once('SIGINT', () => watcher.close());
        });
    }
}