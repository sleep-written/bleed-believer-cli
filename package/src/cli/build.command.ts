import type { ArgvRoute, Command, CommandContext } from '@lib/cli/index.js';
import type { Dirent } from 'fs';

import { TSConfig } from '@lib/ts-config/ts-config.js';
import { join, resolve } from 'path';
import { glob, readFile } from 'fs/promises';
import { transform, type Config, type Options } from '@swc/core';
import { logger } from '@/logger.js';

export const buildCommand: ArgvRoute<void> = {
    path: [ 'build' ],
    target: class implements Command<void> {
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

        async execute(context: CommandContext): Promise<void> {
            const customTarget: string | undefined = (
                context.flags['--config']?.[0] ??
                context.flags['--c']?.[0]
            );

            const tsConfig = await TSConfig.load(customTarget);
            const config = tsConfig.toSWC();
            const files = await this.#getSourceFiles(tsConfig);

            for (const file of files) {
                // await this.#transpile(config, file);
            }
        }
    }
};