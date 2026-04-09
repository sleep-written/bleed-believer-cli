import type { TargetFileInject, TsconfigObject } from './interfaces/index.ts';

import { basename, dirname, isAbsolute, resolve, sep } from 'node:path/posix';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, test } from 'node:test';
import { TargetFile } from './target-file.ts';

const inject: TargetFileInject = {
    sep, dirname, resolve, basename, isAbsolute,
    fileURLToPath: (href: string) => fileURLToPath(href, { windows: false }),
    pathToFileURL: (path: string) => pathToFileURL(path, { windows: false }),
};

describe('tsconfig without "outDir" and "rootDir"', () => {
    const tsconfig: TsconfigObject = {
        path: '/path/to/project/tsconfig.json',
        options: {}
    };

    test('/path/to/project/index.ts → to js', (t: test.TestContext) => {
        const file = new TargetFile('/path/to/project/index.ts', tsconfig, inject);
        t.assert.strictEqual(file.toTs().toString(), '/path/to/project/index.ts');
        t.assert.strictEqual(file.toJs().toString(), '/path/to/project/index.js');
    });

    test('/path/to/project/lib/elphis/elphis.ts → to js', (t: test.TestContext) => {
        const file = new TargetFile('/path/to/project/lib/elphis/elphis.ts', tsconfig, inject);
        t.assert.strictEqual(file.toTs().toString(), '/path/to/project/lib/elphis/elphis.ts');
        t.assert.strictEqual(file.toJs().toString(), '/path/to/project/lib/elphis/elphis.js');
    });
});

describe('tsconfig with "outDir" and "rootDir"', () => {
    const tsconfig: TsconfigObject = {
        path: '/path/to/project/tsconfig.json',
        options: {
            outDir: '/path/to/project/dist',
            rootDir: '/path/to/project/src'
        }
    };

    test('/path/to/project/src/index.ts → to js', (t: test.TestContext) => {
        const file = new TargetFile('/path/to/project/src/index.ts', tsconfig, inject);
        t.assert.strictEqual(file.toTs().toString(), '/path/to/project/src/index.ts');
        t.assert.strictEqual(file.toJs().toString(), '/path/to/project/dist/index.js');
    });

    test('/path/to/project/src/lib/elphis/elphis.ts → to js', (t: test.TestContext) => {
        const file = new TargetFile('/path/to/project/src/lib/elphis/elphis.ts', tsconfig, inject);
        t.assert.strictEqual(file.toTs().toString(), '/path/to/project/src/lib/elphis/elphis.ts');
        t.assert.strictEqual(file.toJs().toString(), '/path/to/project/dist/lib/elphis/elphis.js');
    });
});