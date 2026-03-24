import type { TsconfigJSON } from './interfaces/index.ts';

import { tsconfigToSwcrc } from './tsconfig-to-swcrc.ts';
import test from 'node:test';

test('Load a simple configuration', (t: test.TestContext) => {
    const tsconfig: TsconfigJSON = {
        compilerOptions: {
            target: 'es2024',
            module: 'node20'
        }
    };

    const swcrc = tsconfigToSwcrc(tsconfig);
    t.assert.deepStrictEqual(swcrc, {
        jsc: {
            parser: {
                syntax: 'typescript',
                decorators: true
            },
            transform: {
                decoratorVersion: '2022-03'
            },
            preserveAllComments: true,
            target: 'es2024'
        },
        module: {
            type: 'es6'
        },
        sourceMaps: false
    });
});

test('Load a complex configuration', (t: test.TestContext) => {
    const tsconfig: TsconfigJSON = {
        compilerOptions: {
            target: 'es2024',
            module: 'node20',
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            outDir: 'dist',
            rootDir: 'src',
            sourceMap: false
        }
    };

    const swcrc = tsconfigToSwcrc(tsconfig);
    t.assert.deepStrictEqual(swcrc, {
        jsc: {
            parser: {
                syntax: 'typescript',
                decorators: true
            },
            transform: {
                decoratorVersion: '2021-12',
                decoratorMetadata: true
            },
            target: 'es2024',
            preserveAllComments: true
        },
        module: {
            type: 'es6'
        },
        sourceMaps: false
    });
});