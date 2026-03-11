import { AliasResolver } from './alias-resolver.ts';
import test from 'node:test';

test('Resolve "@lib/pendejo.ts" (win32)', (t: test.TestContext) => {
    const resolver = new AliasResolver(
        {
            path: 'C:\\path\\to\\project\\tsconfig.json',
            compilerOptions: {
                baseUrl: 'src',
                paths: {
                    '@lib/*': [ './lib/*', './lib-32/*' ]
                }
            }
        }
    );

    const result = resolver.resolve('@lib/pendejo.ts');
    t.assert.deepStrictEqual(result, [
        'file:///C:/path/to/project/src/lib/pendejo.ts',
        'file:///C:/path/to/project/src/lib-32/pendejo.ts'
    ]);
});

test('Resolve "@lib/pendejo.ts" (win32, nested)', (t: test.TestContext) => {
    const resolver = new AliasResolver(
        {
            extends: [
                {
                    path: 'C:\\path\\to\\project\\tsconfig.json',
                    compilerOptions: {
                        baseUrl: 'src',
                        paths: {
                            '@lib/*': [ './lib/*', './lib-32/*' ]
                        }
                    }
                }
            ],
            path: 'C:\\path\\to\\project\\tsconfig.build.json',
            compilerOptions: {
                sourceMap: false
            }
        }
    );

    const result = resolver.resolve('@lib/pendejo.ts');
    t.assert.deepStrictEqual(result, [
        'file:///C:/path/to/project/src/lib/pendejo.ts',
        'file:///C:/path/to/project/src/lib-32/pendejo.ts'
    ]);
});

test('Resolve "@lib/pendejo.ts" (linux)', (t: test.TestContext) => {
    const resolver = new AliasResolver(
        {
            path: '/path/to/project/tsconfig.json',
            compilerOptions: {
                baseUrl: 'src',
                paths: {
                    '@lib/*': [ './lib/*', './lib-32/*' ]
                }
            }
        }
    );

    const result = resolver.resolve('@lib/pendejo.ts');
    t.assert.deepStrictEqual(result, [
        'file:///path/to/project/src/lib/pendejo.ts',
        'file:///path/to/project/src/lib-32/pendejo.ts'
    ]);
});

test('Resolve "@lib/pendejo.ts" (linux, nested)', (t: test.TestContext) => {
    const resolver = new AliasResolver(
        {
            extends: [
                {
                    path: '/path/to/project/tsconfig.json',
                    compilerOptions: {
                        baseUrl: 'src',
                        paths: {
                            '@lib/*': [ './lib/*', './lib-32/*' ]
                        }
                    }
                }
            ],
            path: 'C:/path/to/project/tsconfig.build.json',
            compilerOptions: {
                sourceMap: false
            }
        }
    );

    const result = resolver.resolve('@lib/pendejo.ts');
    t.assert.deepStrictEqual(result, [
        'file:///path/to/project/src/lib/pendejo.ts',
        'file:///path/to/project/src/lib-32/pendejo.ts'
    ]);
});

test('Resolve "@lil/pendejo.ts" (null)', (t: test.TestContext) => {
    const resolver = new AliasResolver(
        {
            extends: [
                {
                    path: '/path/to/project/tsconfig.json',
                    compilerOptions: {
                        baseUrl: 'src',
                        paths: {
                            '@lib/*': [ './lib/*', './lib-32/*' ]
                        }
                    }
                }
            ],
            path: 'C:/path/to/project/tsconfig.build.json',
            compilerOptions: {
                sourceMap: false
            }
        }
    );

    const result = resolver.resolve('@lil/pendejo.ts');
    t.assert.deepStrictEqual(result, null);
});