import type { TSConfigLoadInject, TsConfigValue } from './interfaces/index.js';
import { tsConfigLoad } from './ts-config.load.js';
import test from 'ava';

test('Initialize without a tsconfig.json file', async t => {
    const inject: TSConfigLoadInject = {
        process: { cwd: () => '/path/to/project' },
        readFile: path => {
            switch (path) {
                default: {
                    throw new Error(`readFile: file not found`);
                }
            }
        },
        access: path => {
            switch (path) {
                default: {
                    throw new Error(`access: file not found`);
                }
            }
        }
    };

    const tsConfig = await tsConfigLoad(null, inject);
    t.deepEqual(tsConfig.value, {
        exclude: [ 'node_modules' ],
        compilerOptions: {
            target: 'esnext',
            module: 'nodenext',
            moduleResolution: 'nodenext'
        }
    } as TsConfigValue);
});

test('Initialize with a simple tsconfig.json file', async t => {
    const inject: TSConfigLoadInject = {
        process: { cwd: () => '/path/to/project' },
        readFile: path => {
            switch (path) {
                case '/path/to/project/tsconfig.json': {
                    return Promise.resolve(JSON.stringify({
                        compilerOptions: {
                            target: 'es2024',
                            module: 'node20',
                            moduleResolution: 'node16'
                        }
                    } as TsConfigValue));
                }

                default: {
                    throw new Error(`readFile: file not found`);
                }
            }
        },
        access: path => {
            switch (path) {
                case '/path/to/project/tsconfig.json': {
                    return Promise.resolve();
                }

                default: {
                    throw new Error(`access: file not found`);
                }
            }
        }
    };

    const tsConfig = await tsConfigLoad(null, inject);
    t.deepEqual(tsConfig.value, {
        exclude: [ 'node_modules' ],
        compilerOptions: {
            target: 'es2024',
            module: 'node20',
            moduleResolution: 'node16'
        }
    } as TsConfigValue);
});