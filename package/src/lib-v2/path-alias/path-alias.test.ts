import type { PathAliasInject, TsconfigObject } from './interfaces/index.ts';

import { describe, test } from 'node:test';
import { PathAlias } from './path-alias.ts';
import { dirname, resolve, relative, sep } from 'path/posix';
import { fileURLToPath, pathToFileURL } from 'url';

describe('First escenario', () => {
    const files = [
        '/path/to/project/src/lib/elphis/elphis.test.ts',
        '/path/to/project/src/lib/elphis/elphis.ts',
        '/path/to/project/src/lib/elphis/index.ts',
        '/path/to/project/src/data-source.ts',
        '/path/to/project/src/index.ts',
        '/path/to/project/tsconfig.json',
    ];

    const inject: PathAliasInject = {
        fileURLToPath: path => fileURLToPath(path, { windows: false }),
        pathToFileURL: path => pathToFileURL(path, { windows: false }),
        accessSync: path => {
            if (!files.includes(resolve(path))) {
                throw new Error(`File "${path}" not found`);
            }
        },
        relative,
        dirname,
        resolve,
        sep,
    };

    const tsconfig: TsconfigObject = {
        path: '/path/to/project/tsconfig.json',
        options: {
            rootDir: '/path/to/project/src',
            outDir: '/path/to/project/dist',
            paths: {
                '@lib/*':   [ './src/lib/*' ],
                '@/*':      [ './src/*' ],
            }
        }
    };

    test(`Resolve "@lib/elphis/index.ts"`, (t: test.TestContext) => {
        const pathAlias = new PathAlias(tsconfig, inject);
        t.assert.strictEqual(
            pathAlias.resolve('@lib/elphis/index.ts'),
            'file:///path/to/project/src/lib/elphis/index.ts'
        );
    });

    test(`Resolve "@lib/elphis/index.ts" from "/path/to/project/src/index.ts"`, (t: test.TestContext) => {
        const pathAlias = new PathAlias(tsconfig, inject);
        t.assert.strictEqual(
            pathAlias.resolve('@lib/elphis/index.ts', 'file:///path/to/project/src/index.ts'),
            './lib/elphis/index.ts'
        );
    });
});