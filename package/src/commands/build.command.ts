import { dirname, join, resolve, sep } from 'node:path';
import { glob, mkdir, writeFile } from 'node:fs/promises';

import { SWC, ImportExtensionPlugin } from '../lib/swc/index.ts';
import { SourceFile } from '../lib/source-file/index.ts';
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

        const swc = new SWC(tsconfig, [ new ImportExtensionPlugin() ]);
        for await (const file of globIterator) {
            if (!file.isFile()) continue;

            const source = new SourceFile(resolve(file.parentPath, file.name));
            const srcPath = source.toTsExt().path;
            const outPath = source.toJsExt().path.replace(rootDir, outDir);
            const { code, map } = await swc.transform(srcPath, outPath);

            await mkdir(dirname(outPath), { recursive: true });
            await writeFile(outPath, code);

            if (typeof map === 'string') {
                await writeFile(outPath + '.map', map);
            }
        }
    }
)