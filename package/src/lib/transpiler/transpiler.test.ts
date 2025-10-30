import type { TranspilerInject } from './interfaces/index.js';
import type { Options, Output } from '@swc/core';

import { Transpiler } from './transpiler.js';
import { TSConfig } from '@lib/ts-config/ts-config.js';
import test from 'ava';

class TranspilerInjectorFactory implements TranspilerInject {
    filesystem: Record<string, any> = {};

    process = {
        cwd: () => '/path/to/project'
    };

    async readFile(path: string): Promise<string> {
        switch (path) {
            case '/path/to/project/src/utils/foo.ts':
            case '/path/to/project/src/utils/bar.ts':
            case '/path/to/project/src/tools/lol.ts':
            case '/path/to/project/src/tools/kek.ts':
            case '/path/to/project/src/tools/iei.ts':
            case '/path/to/project/src/index.ts': {
                return JSON.stringify({ path, data: 'typescript-module' });
            }

            default: {
                throw new Error(`File "${path}" not found`);
            }
        }
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
        const code = JSON.parse(source);
        code.data = 'module';

        const output: Output = { code };
        if (options?.sourceMaps === true) {
            output.map = JSON.stringify({
                path: code.path,
                data: 'typescript-map'
            });
        }

        return output;
    }
}

test('Simple escenario', async t => {
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
    t.deepEqual(inject.filesystem, {
        'path/to/project/dist/index.js': {
            path: '/path/to/project/src/index.ts',
            data: 'module'
        }
    });
});