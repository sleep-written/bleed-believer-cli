import type { PathAliasInject, TsconfigObject } from './interfaces/index.ts';

import { dirname, normalize, relative, resolve, sep } from 'node:path/posix';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, test } from 'node:test';
import { PathAlias } from './path-alias.ts';

class Inject implements PathAliasInject {
    #files: string[];

    get sep(): string {
        return sep;
    }

    constructor(files: string[]) {
        this.#files = files.map(x => normalize(x));
    }

    accessSync(path: string): void {
        const normalizedPath = normalize(path);
        if (!this.#files.includes(normalizedPath)) {
            throw new Error(`The file "${normalizedPath}" doesn't exists`);
        }
    }

    dirname(path: string): string {
        return dirname(path);
    }

    fileURLToPath(url: string): string {
        return fileURLToPath(url, { windows: false });
    }

    pathToFileURL(path: string): URL {
        return pathToFileURL(path, { windows: false });
    }

    relative(from: string, to: string): string {
        return relative(from, to);
    }

    resolve(...p: string[]): string {
        return resolve(...p);
    }
}

const inject = new Inject([
    '/path/to/project/src/lib/elphis/elphis.test.ts',
    '/path/to/project/src/lib/elphis/elphis.ts',
    '/path/to/project/src/lib/elphis/index.ts',
    '/path/to/project/src/data-source.ts',
    '/path/to/project/src/index.ts',
    '/path/to/project/tsconfig.json',
]);

const tsconfig: TsconfigObject = {
    path: '/path/to/project/tsconfig.json',
    options: {
        rootDir: '/path/to/project/src',
        outDir: '/path/to/project/dist',
        paths: {
            '@lib/*': [ './src/lib/*' ],
            '@/*': [ './src/*' ],
        }
    }
};

describe('Resolve to rootDir', () => {
    test('import "@lib/elphis/index.ts" from "/path/to/project/src/index.ts"', (t: test.TestContext) => {
        const pathAlias = new PathAlias(tsconfig, false, inject);
        const result = pathAlias.resolve(
            '@lib/elphis/index.ts',
            '/path/to/project/src/index.ts'
        );
    
        t.assert.strictEqual(result, './lib/elphis/index.ts');
    });
    
    test('import "@/data-source.ts" from "/path/to/project/src/lib/elphis/elphis.test.ts"', (t: test.TestContext) => {
        const pathAlias = new PathAlias(tsconfig, false, inject);
        const result = pathAlias.resolve(
            '@/data-source.ts',
            '/path/to/project/src/lib/elphis/elphis.test.ts'
        );
    
        t.assert.strictEqual(result, './../../data-source.ts');
    });
    
    test('import "typeorm" from "/path/to/project/src/lib/elphis/elphis.test.ts"', (t: test.TestContext) => {
        const pathAlias = new PathAlias(tsconfig, false, inject);
        const result = pathAlias.resolve(
            'typeorm',
            '/path/to/project/src/lib/elphis/elphis.test.ts'
        );
    
        t.assert.strictEqual(result, 'typeorm');
    });
    
    test('import "discord.js" from "/path/to/project/src/lib/elphis/elphis.test.ts"', (t: test.TestContext) => {
        const pathAlias = new PathAlias(tsconfig, false, inject);
        const result = pathAlias.resolve(
            'discord.js',
            '/path/to/project/src/lib/elphis/elphis.test.ts'
        );
    
        t.assert.strictEqual(result, 'discord.js');
    });
});

describe('Resolve to outDir', () => {
    test('import "@lib/elphis/index.ts" from "/path/to/project/dist/index.js"', (t: test.TestContext) => {
        const pathAlias = new PathAlias(tsconfig, true, inject);
        const result = pathAlias.resolve(
            '@lib/elphis/index.ts',
            '/path/to/project/dist/index.js'
        );
    
        t.assert.strictEqual(result, './lib/elphis/index.js');
    });
    
    test('import "@/data-source.ts" from "/path/to/project/dist/lib/elphis/elphis.test.js"', (t: test.TestContext) => {
        const pathAlias = new PathAlias(tsconfig, true, inject);
        const result = pathAlias.resolve(
            '@/data-source.ts',
            '/path/to/project/dist/lib/elphis/elphis.test.js'
        );
    
        t.assert.strictEqual(result, './../../data-source.js');
    });
    
    test('import "typeorm" from "/path/to/project/dist/lib/elphis/elphis.test.js"', (t: test.TestContext) => {
        const pathAlias = new PathAlias(tsconfig, true, inject);
        const result = pathAlias.resolve(
            'typeorm',
            '/path/to/project/dist/lib/elphis/elphis.test.js'
        );
    
        t.assert.strictEqual(result, 'typeorm');
    });
    
    test('import "discord.ts" from "/path/to/project/dist/lib/elphis/elphis.test.js"', (t: test.TestContext) => {
        const pathAlias = new PathAlias(tsconfig, true, inject);
        const result = pathAlias.resolve(
            'discord.ts',
            '/path/to/project/dist/lib/elphis/elphis.test.js'
        );
    
        t.assert.strictEqual(result, 'discord.ts');
    });
});