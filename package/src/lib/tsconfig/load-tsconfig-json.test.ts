import type { TsconfigJSON } from './interfaces/tsconfig-json.ts';

import { dirname, resolve, isAbsolute } from 'node:path/posix';
import { loadTsconfigJSON } from './load-tsconfig-json.ts';
import test from 'node:test';

test('Read an empty file', async (t: test.TestContext) => {
    const result = await loadTsconfigJSON('', {
        readFile: (_, __) => Promise.resolve(`{}`)
    });

    t.assert.deepStrictEqual(result, {});
});

test('Read a file with comments', async (t: test.TestContext) => {
    const result = await loadTsconfigJSON('', {
        readFile: (_, __) => Promise.resolve(`{
            /**
             * Soy un pendejo mamavergas
             */
            "compilerOptions": {
                "strict": true,

                // Perreo ijoeputaaaaaaaaa
                "target": "ES2024",
                "module": "ESNEXT"
            }
        }`)
    });

    t.assert.deepStrictEqual(result, {
        compilerOptions: {
            strict: true,
            target: 'es2024',
            module: 'esnext'
        }
    } as TsconfigJSON);
});

test('Read a file with extends', async (t: test.TestContext) => {
    const result = await loadTsconfigJSON(`/path/to/project/packages/inner/tsconfig.build.json`, {
        dirname: dirname,
        resolve: resolve,
        isAbsolute: isAbsolute,

        readFile: (path, _) => {
            switch(path) {
                case `/path/to/project/tsconfig.json`: {
                    return Promise.resolve(`{
                        "compilerOptions": {
                            "strict": true,
                            "target": "es2024",
                            "module": "node20"
                        },
                        "exclude": [
                            "./node_modules/**"
                        ]
                    }`);
                }

                case `/path/to/project/packages/inner/tsconfig.json`: {
                    return Promise.resolve(`{
                        "extends": "../../tsconfig.json",
                        "compilerOptions": {
                            "outDir": "dist",
                            "rootDir": "src",
                            "sourceMap": true
                        }
                    }`);
                }

                case `/path/to/project/packages/inner/tsconfig.build.json`: {
                    return Promise.resolve(`{
                        "extends": [ "./tsconfig.json" ],
                        "compilerOptions": {
                            "sourceMap": false
                        },
                        "exclude": [
                            "./src/**/*.test.ts"
                        ]
                    }`);
                }

                default: {
                    throw new Error(`The file "${path}" doesn't exists`);
                }
            }
        }
    });

    t.assert.deepStrictEqual(result, {
        compilerOptions: {
            strict: true,
            target: 'es2024',
            module: 'node20',

            outDir: 'dist',
            rootDir: 'src',
            sourceMap: false,
        },
        exclude: [
            './node_modules/**',
            './src/**/*.test.ts'
        ]
    } as TsconfigJSON);
});