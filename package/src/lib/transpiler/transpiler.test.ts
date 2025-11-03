import type { TranspilerInject } from './interfaces/index.js';
import type { Options, Output } from '@swc/core';

import { Transpiler } from './transpiler.js';
import { TSConfig } from '@lib/ts-config/ts-config.js';
import test from 'ava';
import { join } from 'path';

class TranspilerInjectorFactory implements TranspilerInject {
    filesystem: Record<string, any> = {};

    process = {
        cwd: () => '/path/to/project'
    };

    constructor() {
        const type = 'typescript-module';
        const sourceFiles = [
            { folder: 'src/utils', name: 'foo.ts' },
            { folder: 'src/utils', name: 'bar.ts' },
            { folder: 'src/tools', name: 'lol.ts' },
            { folder: 'src/tools', name: 'kek.ts' },
            { folder: 'src/tools', name: 'iei.ts' },
            { folder: 'src',       name: 'index.ts' }
        ];

        for (const { name, folder } of sourceFiles) {
            const path = join(this.process.cwd(), folder, name);
            this.filesystem[path] = { path, type };
        }
    }

    async readFile(path: string): Promise<string> {
        const json = this.filesystem[path];
        if (typeof json == null) {
            throw new Error(`File "${path}" not found`);
        }

        return JSON.stringify(json);
    }

    async mkdir(): Promise<string | undefined> {
        return Promise.resolve(undefined);
    }

    async writeFile(path: string, data: Buffer): Promise<void>;
    async writeFile(path: string, data: string, encoding: 'utf-8'): Promise<void>;
    async writeFile(path: string, data: string | Buffer): Promise<void> {
        if (Buffer.isBuffer(data)) {
            data = data.toString('utf-8');
        }

        this.filesystem[path] = JSON.parse(data);
    }

    async transform(source: string, options?: Options): Promise<Output> {
        const json = JSON.parse(source);
        json.type = 'javascript-module';
        const code = JSON.stringify(json);

        const output: Output = { code };
        if (options?.sourceMaps === true) {
            output.map = JSON.stringify({
                name: json.path,
                data: 'typescript-map'
            });
        }

        return output;
    }
}

test('Transpile "/path/to/project/src/index.ts"', async t => {
    const inject = new TranspilerInjectorFactory();
    const tsConfig = new TSConfig(
        {
            compilerOptions: {
                outDir: 'dist',
                rootDir: 'src'
            }
        },
        { process: inject.process }
    );

    const transpiler = new Transpiler(tsConfig, inject);
    await transpiler.transpile({ name: 'index.ts', parentPath: '/path/to/project/src' });

    const source = inject.filesystem['/path/to/project/src/index.ts'];
    t.deepEqual(source, {
        path: '/path/to/project/src/index.ts',
        type: 'typescript-module',
    });

    const result = inject.filesystem['/path/to/project/dist/index.js'];
    t.deepEqual(result, {
        path: '/path/to/project/src/index.ts',
        type: 'javascript-module',
    });
});

test('Transpile "/path/to/project/src/utils/bar.ts"', async t => {
    const inject = new TranspilerInjectorFactory();
    const tsConfig = new TSConfig(
        {
            compilerOptions: {
                outDir: 'dist',
                rootDir: 'src'
            }
        },
        { process: inject.process }
    );

    const transpiler = new Transpiler(tsConfig, inject);
    await transpiler.transpile({ name: 'bar.ts', parentPath: '/path/to/project/src/utils' });

    const source = inject.filesystem['/path/to/project/src/utils/bar.ts'];
    t.deepEqual(source, {
        path: '/path/to/project/src/utils/bar.ts',
        type: 'typescript-module',
    });

    const result = inject.filesystem['/path/to/project/dist/utils/bar.js'];
    t.deepEqual(result, {
        path: '/path/to/project/src/utils/bar.ts',
        type: 'javascript-module',
    });
});

test('Transpile "/path/to/project/src/tools/kek.ts"', async t => {
    const inject = new TranspilerInjectorFactory();
    const tsConfig = new TSConfig(
        {
            compilerOptions: {
                outDir: 'dist',
                rootDir: 'src'
            }
        },
        { process: inject.process }
    );

    const transpiler = new Transpiler(tsConfig, inject);
    await transpiler.transpile({ name: 'kek.ts', parentPath: '/path/to/project/src/tools' });

    const source = inject.filesystem['/path/to/project/src/tools/kek.ts'];
    t.deepEqual(source, {
        path: '/path/to/project/src/tools/kek.ts',
        type: 'typescript-module',
    });

    const result = inject.filesystem['/path/to/project/dist/tools/kek.js'];
    t.deepEqual(result, {
        path: '/path/to/project/src/tools/kek.ts',
        type: 'javascript-module',
    });
});