import type { SourceFileInject } from './interfaces/index.ts';

import { dirname, resolve, sep } from 'node:path/posix';
import { SourceFile } from './source-file.ts';
import test from 'node:test';

class Inject implements SourceFileInject {
    #files: Record<string, string>;

    get sep(): string {
        return sep;
    }

    constructor(files: Record<string, string>) {
        this.#files = files;
    }

    async readFile(path: string, _: BufferEncoding): Promise<string> {
        const text = this.#files[path];
        if (typeof text !== 'string') {
            throw new Error(`File "${path}" not found`);
        }

        return text;
    }

    async access(path: string): Promise<void> {
        if (typeof this.#files[path] !== 'string') {
            throw new Error(`File "${path}" not found`);
        }
    }

    dirname(path: string): string {
        return dirname(path);
    }

    resolve(...parts: string[]): string {
        return resolve(...parts);
    }
}

test('Example', async (t: test.TestContext) => {
    const inject = new Inject({
        '/path/to/project/src/index.ts': `console.log('kek')`
    });

    const source = new SourceFile('/path/to/project/src/index.ts', inject);
    t.assert.strictEqual(await source.exists(), true);

    const target = source.toJsExt();
    t.assert.strictEqual(target.path, '/path/to/project/src/index.js');
    t.assert.strictEqual(await target.exists(), false);
});