import type { FindTsconfigInject, StatResult } from './find-tsconfig.ts';
import type { ParsedPath } from 'node:path';
import { findTsconfig } from './find-tsconfig.ts';
import test from 'node:test';
import { dirname, isAbsolute, parse, resolve } from 'node:path/posix';

class Inject implements FindTsconfigInject {
    #files: string[];

    constructor(files: string[]) {
        this.#files = files;
    }

    isAbsolute(path: string): boolean {
        return isAbsolute(path);
    }

    dirname(path: string): string {
        return dirname(path);
    }

    resolve(...p: string[]): string {
        return resolve(...p);
    }

    parse(path: string): ParsedPath {
        return parse(path);
    }

    async stat(path: string): Promise<StatResult> {
        if (this.#files.includes(path)) {
            return { isFile: () => true };
        } else {
            const rnd = Math.random();
            if (rnd < 0.5) {
                return { isFile: () => false };
            } else {
                throw new Error('jajaja');
            }
        }
    }
}

test('Search tsconfig next to file', async (t: test.TestContext) => {
    const inject = new Inject([
        '/path/to/project/index.ts',
        '/path/to/project/tsconfig.json',
    ]);

    const path = await findTsconfig('/path/to/project/index.ts', inject);
    t.assert.strictEqual(path, '/path/to/project/tsconfig.json');
});

test('Search tsconfig on ancestor dir', async (t: test.TestContext) => {
    const inject = new Inject([
        '/path/to/project/src/index.ts',
        '/path/to/project/package.json',
        '/path/to/project/tsconfig.json',
    ]);

    const path = await findTsconfig('/path/to/project/src/index.ts', inject);
    t.assert.strictEqual(path, '/path/to/project/tsconfig.json');
});

test('Search tsconfig on root', async (t: test.TestContext) => {
    const inject = new Inject([
        '/path/to/project/src/index.ts',
        '/path/to/project/package.json',
        '/tsconfig.json',
    ]);

    const path = await findTsconfig('/path/to/project/src/index.ts', inject);
    t.assert.strictEqual(path, '/tsconfig.json');
});