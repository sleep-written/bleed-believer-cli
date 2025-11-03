import type { ArgvRoute, Command, CommandContext } from '@lib/cli/index.js';
import type { Dirent } from 'fs';

import { Transpiler } from '@lib/transpiler/index.js';
import { TSConfig } from '@lib/ts-config/ts-config.js';
import { logger } from '@/logger.js';

import { join, resolve } from 'path';
import { glob } from 'fs/promises';

export const buildCommand: ArgvRoute<void> = {
    name: 'npx bleed build [--config path/to/tsconfig.json]',
    info: 'Transpile all files to JavaScript (like `tsc`, but faster).',

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
            const files = await this.#getSourceFiles(tsConfig);
            
            const transpiler = new Transpiler(tsConfig);
            const cwd = process.cwd();
            for (const file of files) {
                const path = join(
                    file.parentPath.slice(cwd.length),
                    file.name
                );

                logger.info(`Transpiling "${path}"`);
                await transpiler.transpile(file);
            }
        }
    }
};