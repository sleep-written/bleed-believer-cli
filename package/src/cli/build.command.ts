import type { CommandModule } from 'yargs';
import type { Dirent } from 'fs';

import { FileTranspiler } from '@lib/transpiler/index.js';
import { TSConfig } from '@lib/ts-config/ts-config.js';
import { logger } from '@/logger.js';

import { join, resolve } from 'path';
import { glob } from 'fs/promises';

interface Argv {
    config?: string;
    '--'?: string[];
}

async function getSourceFiles(tsConfig: TSConfig): Promise<Dirent<string>[]> {
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

export const buildCommand: CommandModule<{}, Argv> = {
    command:    'build',
    describe:   'Transpile the whole project using SWC',
    builder:    yargs => yargs
        .options('config', {
            string: true,
            description: 'The custom "tsconfig.json" do you want to use',
        })
        .parserConfiguration({
            "populate--": true
        }),
    handler: async argv => {
        const tsConfig = await TSConfig.load(argv.config);
        const files = await getSourceFiles(tsConfig);
        
        const transpiler = new FileTranspiler(tsConfig);
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