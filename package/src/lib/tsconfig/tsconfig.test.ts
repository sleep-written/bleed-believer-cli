import { dirname, isAbsolute, resolve } from 'node:path/posix';
import { Tsconfig } from './tsconfig.ts';
import test from 'node:test';

test('Check path alias', async (t: test.TestContext) => {
    const tsconfig = new Tsconfig(
        '/path/to/project/tsconfig.json',
        {
            compilerOptions: {
                baseUrl: 'src',
                paths: {
                    '@joder/*':     [ 'joder/*' ],
                    '@pendejo/*':   [ 'pendejo-x86/*', 'pendejo-x64/*' ],
                    '@data-source': [ 'data-source.ts' ]
                }
            }
        },
        {
            dirname: dirname,
            resolve: resolve,
            isAbsolute: isAbsolute
        }
    );

    const alias = tsconfig.resolve('@data-source');
    t.assert.deepStrictEqual(alias, [
        '/path/to/project/src/data-source.ts'
    ]);
});

test('Check path alias with wildcard (1 result)', async (t: test.TestContext) => {
    const tsconfig = new Tsconfig(
        '/path/to/project/tsconfig.json',
        {
            compilerOptions: {
                baseUrl: 'src',
                paths: {
                    '@joder/*':     [ 'joder/*' ],
                    '@pendejo/*':   [ 'pendejo-x86/*', 'pendejo-x64/*' ],
                    '@data-source': [ 'data-source.ts' ]
                }
            }
        },
        {
            dirname: dirname,
            resolve: resolve,
            isAbsolute: isAbsolute
        }
    );

    const alias = tsconfig.resolve('@joder/jajaja.ts');
    t.assert.deepStrictEqual(alias, [
        '/path/to/project/src/joder/jajaja.ts',
    ]);
});

test('Check path alias with wildcard (2 results)', async (t: test.TestContext) => {
    const tsconfig = new Tsconfig(
        '/path/to/project/tsconfig.json',
        {
            compilerOptions: {
                baseUrl: 'src',
                paths: {
                    '@joder/*':     [ 'joder/*' ],
                    '@pendejo/*':   [ 'pendejo-x86/*', 'pendejo-x64/*' ],
                    '@data-source': [ 'data-source.ts' ]
                }
            }
        },
        {
            dirname: dirname,
            resolve: resolve,
            isAbsolute: isAbsolute
        }
    );

    const alias = tsconfig.resolve('@pendejo/jajaja.ts');
    t.assert.deepStrictEqual(alias, [
        '/path/to/project/src/pendejo-x86/jajaja.ts',
        '/path/to/project/src/pendejo-x64/jajaja.ts',
    ]);
});