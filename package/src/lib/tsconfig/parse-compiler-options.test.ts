import type { CompilerOptions } from './interfaces/index.ts';
import { parseCompilerOptions } from './parse-compiler-options.ts';
import test from 'node:test';

test('Parse case 01 (invalid input object)', (t: test.TestContext) => {
    const r = parseCompilerOptions(666);
    t.assert.deepStrictEqual(r, {});
});

test('Parse case 02', (t: test.TestContext) => {
    const r = parseCompilerOptions({
        target: 'ES2024',
        module: 'NODE20'
    });

    t.assert.deepStrictEqual(r, {
        target: 'es2024',
        module: 'node20'
    } as CompilerOptions);
});

test('Parse case 03 (invalid target)', (t: test.TestContext) => {
    const r = parseCompilerOptions({
        target: 'caca',
        module: 'NODE20'
    });

    t.assert.deepStrictEqual(r, {
        module: 'node20'
    } as CompilerOptions);
});

test('Parse case 04', (t: test.TestContext) => {
    const r = parseCompilerOptions({
        target: 'ES2024',
        module: 'NODE20',
        rootDir: 'src',
        baseUrl: 'src',
        paths: {
            '@foo/*': [ './foo/*' ],
            '@bar/*': './bar/*'
        }
    });

    t.assert.deepStrictEqual(r, {
        target: 'es2024',
        module: 'node20',
        rootDir: 'src',
        baseUrl: 'src',
        paths: {
            '@foo/*': [ './foo/*' ],
            '@bar/*': [ './bar/*' ]
        }
    } as CompilerOptions);
});

test('Parse case 05 (invalid path struct)', (t: test.TestContext) => {
    const r = parseCompilerOptions({
        target: 'ES2024',
        module: 'NODE20',
        moduleResolution: 'NODE16',
        rootDir: 'src',
        baseUrl: 'src',
        paths: {
            '@foo/*': 666,
            '@bar/*': 999
        }
    });

    t.assert.deepStrictEqual(r, {
        target: 'es2024',
        module: 'node20',
        moduleResolution: 'node16',
        rootDir: 'src',
        baseUrl: 'src'
    } as CompilerOptions);
});

test('Parse case 06 (with undefined values)', (t: test.TestContext) => {
    const r = parseCompilerOptions({
        target: 'ES2024',
        module: 'NODE20',
        rootDir: undefined
    });

    t.assert.deepStrictEqual(r, {
        target: 'es2024',
        module: 'node20'
    } as CompilerOptions);
});