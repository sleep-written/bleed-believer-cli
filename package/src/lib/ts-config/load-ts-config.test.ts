import type { LoadTSConfigInject, TSConfig } from './interfaces/index.js';

import { loadTSConfig } from './load-ts-config.js';
import test from 'ava';

test.only('Read basic file', async t => {
    const inject: LoadTSConfigInject = {
        process: {
            cwd: () => '/path/to/project'
        },
        readFile: async path => {
            switch (path) {
                case '/path/to/project/tsconfig.json': {
                    return JSON.stringify({
                        compilerOptions: {
                            strict: true,
                            target: 'esnext',
                            module: 'nodenext'
                        }
                    } as TSConfig);
                }

                default: {
                    throw new Error(`File not found at "${path}"`);
                }
            }
        }
    };

    const result = await loadTSConfig('tsconfig.json', inject);
    t.deepEqual(result, {
        compilerOptions: {
            strict: true,
            target: 'esnext',
            module: 'nodenext'
        }
    });
});

test('Read basic file with one extends', async t => {
    const inject: LoadTSConfigInject = {
        process: {
            cwd: () => '/path/to/project'
        },
        readFile: async path => {
            switch (path) {
                case '/path/to/project/tsconfig.json': {
                    return JSON.stringify({
                        extends: '../tsconfig.json',
                        compilerOptions: {
                            outDir: 'dist',
                            rootDir: 'src'
                        }
                    } as TSConfig);
                }

                case '/path/to/tsconfig.json': {
                    return JSON.stringify({
                        compilerOptions: {
                            strict: true,
                            target: 'esnext',
                            module: 'nodenext'
                        }
                    } as TSConfig);
                }

                default: {
                    throw new Error(`File not found at "${path}"`);
                }
            }
        }
    };

    const result = await loadTSConfig('tsconfig.json', inject);
    t.deepEqual(result, {
        compilerOptions: {
            strict: true,
            target: 'esnext',
            module: 'nodenext',
            outDir: 'dist',
            rootDir: 'src'
        }
    });
});

test('Read basic file with one extends (with an override)', async t => {
    const inject: LoadTSConfigInject = {
        process: {
            cwd: () => '/path/to/project'
        },
        readFile: async path => {
            switch (path) {
                case '/path/to/project/tsconfig.json': {
                    return JSON.stringify({
                        extends: '../tsconfig.json',
                        compilerOptions: {
                            outDir: 'dist',
                            rootDir: 'src',
                            sourceMap: false
                        }
                    } as TSConfig);
                }

                case '/path/to/tsconfig.json': {
                    return JSON.stringify({
                        compilerOptions: {
                            strict: true,
                            target: 'esnext',
                            module: 'nodenext',
                            sourceMap: true
                        }
                    } as TSConfig);
                }

                default: {
                    throw new Error(`File not found at "${path}"`);
                }
            }
        }
    };

    const result = await loadTSConfig('tsconfig.json', inject);
    t.deepEqual(result, {
        compilerOptions: {
            strict: true,
            target: 'esnext',
            module: 'nodenext',
            outDir: 'dist',
            rootDir: 'src',
            sourceMap: false
        }
    });
});

test('Check circular extends error', async t => {
    const inject: LoadTSConfigInject = {
        process: {
            cwd: () => '/path/to/project'
        },
        readFile: async path => {
            switch (path) {
                case '/path/to/project/tsconfig.json': {
                    return JSON.stringify({
                        extends: '../tsconfig.json',
                        compilerOptions: {
                            outDir: 'dist',
                            rootDir: 'src'
                        }
                    } as TSConfig);
                }
                
                case '/path/to/tsconfig.json': {
                    return JSON.stringify({
                        extends: './project/tsconfig.json',
                        compilerOptions: {
                            strict: true,
                            target: 'es2024',
                            module: 'node20'
                        }
                    } as TSConfig);
                }

                default: {
                    throw new Error(`File not found at "${path}"`);
                }
            }
        }
    };

    await t.throwsAsync(
        () => loadTSConfig(null, inject),
        {
            message: 'The configuration file "/path/to/project/tsconfig.json" is already merged'
        }
    );
});