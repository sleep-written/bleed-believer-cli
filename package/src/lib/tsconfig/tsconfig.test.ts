import type { CompilerOptions, TsconfigLoadInject } from './interfaces/index.ts';
import { Tsconfig } from './tsconfig.ts';
import { resolve } from 'node:path/posix';
import test from 'node:test';

class Inject implements TsconfigLoadInject {
    #files: Record<string, string> = {
        '/path/to/project/tsconfig.json': `{
            "compilerOptions": {
                /**
                 * Aquí va mi mierda
                 */
                "strict": true,
                "target": "ES2024",
                "module": "NODE20",
                "moduleResolution": "NODE16"
            }
        }`,

        '/path/to/project/server/tsconfig.json': `{
            "extends": [ "../tsconfig.json" ],
            "compilerOptions": {
                "outDir": "dist",
                "rootDir": "src",
                "sourceMap": true
            }
        }`,

        '/path/to/project/server/tsconfig.build.json': `{
            "extends": [ "./tsconfig.json" ],
            "compilerOptions": {
                "sourceMap": false
            },
            "exclude": [
                // Quitar archivos de tests
                "**/*.test.ts",
            ]
        }`
    };

    isAbsolute(path: string): boolean {
        return path.startsWith('/');
    }

    readFile(path: string, _: BufferEncoding): Promise<string> {
        const text = this.#files[path];
        if (typeof text !== 'string') {
            throw new Error(`File at "${path}" not found`);
        }

        return Promise.resolve(text);
    }

    resolve(path: string, ...n: string[]): string {
        return resolve(path, ...n);
    }

    process: { cwd(): string; };

    constructor(cwd: string) {
        this.process = { cwd: () => cwd };
    }
}

test('Load single file', async (t: test.TestContext) => {
    const inject = new Inject('/path/to/project');
    const tsconfig = await Tsconfig.load('tsconfig.json', inject);

    t.assert.deepStrictEqual(tsconfig.compilerOptions, {
        strict: true,
        target: 'es2024',
        module: 'node20',
        moduleResolution: 'node16'
    } as CompilerOptions);
});

test('Load nested file', async (t: test.TestContext) => {
    const inject = new Inject('/path/to/project/server');
    const tsconfig1 = await Tsconfig.load('tsconfig.build.json', inject);
    const tsconfig2 = tsconfig1.extends![0];
    const tsconfig3 = tsconfig2.extends![0];

    t.assert.deepStrictEqual(tsconfig3.compilerOptions, {
        strict: true,
        target: 'es2024',
        module: 'node20',
        moduleResolution: 'node16'
    } as CompilerOptions);

    t.assert.deepStrictEqual(tsconfig2.compilerOptions, {
        outDir: 'dist',
        rootDir: 'src',
        sourceMap: true
    } as CompilerOptions);

    t.assert.deepStrictEqual(tsconfig1.exclude, [ '**/*.test.ts' ]);
    t.assert.deepStrictEqual(tsconfig1.compilerOptions, {
        sourceMap: false
    } as CompilerOptions);
});