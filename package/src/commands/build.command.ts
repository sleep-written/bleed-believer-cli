import type { Options } from '@swc/core';

import { glob, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';

import { SWCTranspiler, ModuleExtensionsVisitor } from '../lib/swc-transpiler/index.ts';
import { Tsconfig } from '../lib/tsconfig/index.ts';
import { CLI } from '../lib/cli/index.ts';

export const buildCommand = CLI.createCommand(
    {
        positionals: [ 'build' ] as const,
        info: 'Builds the entire project using swc under the hood',
        options: {
            config: {
                short: 'c',
                type: 'string',
                info: 'Sets the tsconfig.json do you want to use'
            }
        }
    },
    async o => {
        const tsconfig = await Tsconfig.load(resolve(o.flags.config ?? 'tsconfig.json'));

        const cwd = dirname(tsconfig.path);
        const outDir = resolve(cwd, tsconfig.json?.compilerOptions?.outDir ?? '.') + sep;
        const rootDir = resolve(cwd, tsconfig.json?.compilerOptions?.rootDir ?? '.') + sep;
        const globIterator = glob(
            [
                join(
                    tsconfig.json?.compilerOptions?.rootDir ?? '.',
                    '**', '*.{ts,cts,mts,tsx,ctsx,mtsx}'
                ),
                ...(tsconfig.json?.include ?? []).map(x => resolve(x))
            ],
            {
                cwd,
                exclude: tsconfig.json?.exclude,
                withFileTypes: true
            }
        );

        const config = tsconfig.toSwcConfig();
        const transpiler = new SWCTranspiler([ new ModuleExtensionsVisitor(true) ]);
        for await (const file of globIterator) {
            if (!file.isFile()) continue;

            const options: Options = structuredClone(config);
            options.cwd = cwd;
            options.filename = resolve(file.parentPath, file.name);
            options.outputPath = outDir + options.filename
                .slice(rootDir.length)
                .replace(
                    /(?<=\.(?:m|c)?)t(?=sx?$)/i,
                    v => v === v.toUpperCase()
                    ?   'J'
                    :   'j'
                );
                
            const src = await readFile(options.filename, 'utf-8');
            const { code, map } = await transpiler.transform(src, options);

            await mkdir(dirname(options.outputPath), { recursive: true });
            await writeFile(options.outputPath, code);

            if (typeof map === 'string') {
                await writeFile(options.outputPath + '.map', map);
            }
        }
    }
)