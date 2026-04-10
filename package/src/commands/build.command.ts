import { dirname, join, resolve } from 'node:path';
import { glob, mkdir, writeFile } from 'node:fs/promises';

import { Transpiler, PathAliasPlugin } from '../lib/transpiler/index.ts';
import { styleText } from 'node:util';
import { Tsconfig } from '../lib/tsconfig/index.ts';
import { banner } from '../banner.ts';
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
        console.log(banner);
        const tsconfig = Tsconfig.load(resolve(o.flags.config ?? 'tsconfig.json'));
        const tsconfigDir = dirname(tsconfig.path);
        const globIterator = glob(
            [
                join(
                    tsconfig.options.rootDir ?? tsconfigDir,
                    '**', '*.{ts,cts,mts,tsx,ctsx,mtsx}'
                ),
                ...tsconfig.include
            ],
            {
                cwd: tsconfigDir,
                exclude: tsconfig.exclude,
                withFileTypes: true
            }
        );

        const transpiler = new Transpiler(tsconfig, [
            new PathAliasPlugin(tsconfig, true)
        ]);

        for await (const file of globIterator) {
            if (!file.isFile()) continue;

            const path = resolve(file.parentPath, file.name);
            const resp = await transpiler.transpile(path);
            
            await mkdir(dirname(resp.path), { recursive: true });
            await writeFile(resp.path, resp.code);

            console.info(
                'File transpiled',
                styleText(
                    'greenBright',
                    `".${path.slice(tsconfigDir.length)}"`
                ) + ';'
            );

            if (typeof resp.map === 'string') {
                await writeFile(resp.path + '.map', resp.map);
            }
        }
    }
)