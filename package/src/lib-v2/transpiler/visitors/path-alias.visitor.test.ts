import type { PathAliasVisitorInject, TsconfigObject } from './path-alias.visitor.inject.ts';
import type { TranspilerInject } from '../interfaces/index.ts';

import { dirname, isAbsolute, relative, resolve, sep, parse } from 'node:path/posix';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { ModuleKind, ModuleResolutionKind, ScriptTarget } from 'typescript';
import { PathAliasVisitor } from './path-alias.visitor.ts';
import { Transpiler } from '../transpiler.ts';
import { PathAlias } from '../../path-alias/index.ts';
import { test } from 'node:test';

const files: Record<string, string> = {
'/path/to/project/src/index.ts':
`import { Elphis } from '@lib/elphis/index.ts';
import { leon } from '@/leon.ts';
const elphis = new Elphis();
const success: boolean = elphis.curePatient(leon);`,

'/path/to/project/src/leon.ts':
`export const leon = {};`,

'/path/to/project/src/lib/elphis/index.ts':
`export { Elphis } from './elphis.ts';`,

'/path/to/project/src/lib/elphis/elphis.ts':
`export class Elphis {
    curePatient(target: any): boolean {
        throw new Error('Not implemented yet!');
    }
}`
};

class FakePathAlias extends PathAlias {
    constructor(tsconfig: TsconfigObject) {
        super(tsconfig, {
            dirname, isAbsolute, relative, resolve, sep,
            fileURLToPath:  href => fileURLToPath(href, { windows: false }),
            pathToFileURL:  path => pathToFileURL(path, { windows: false }),
            accessSync:     path => {
                if (!Object.keys(files).includes(path)) {
                    throw new Error(`The file "${path}" doesn't exists`);
                }
            }
        });
    }
}

const tsconfig: TsconfigObject = {
    path: '/path/to/project/tsconfig.json',
    options: {
        moduleResolution: ModuleResolutionKind.Node16,
        sourceMap: true,
        module: ModuleKind.Node16,
        target: ScriptTarget.ES2025,
        strict: true,

        rootDir: '/path/to/project/src',
        outDir: '/path/to/project/dist',
        paths: {
            '@lib/*':   [ './src/lib/*' ],
            '@/*':      [ './src/*' ],
        }
    }
};

const visitorInject: PathAliasVisitorInject = {
    pathAlias: FakePathAlias
};

const transpilerInject: TranspilerInject = {
    getImpliedNodeFormatForFile: () => ModuleKind.ESNext,
    readFile: async path => {
        if (typeof files[path] !== 'string') {
            throw new Error(`The file "${path}" doesn't exists`);
        }

        return files[path];
    },
    resolve,
    dirname,
    parse
};

const pathAliasVisitor = new PathAliasVisitor(tsconfig, visitorInject);
const transpiler = new Transpiler(
    tsconfig,
    [
        pathAliasVisitor.callExpressionVisitor,
        pathAliasVisitor.stringLiteralVisitor
    ],
    transpilerInject
);

test('Transpile "/path/to/project/src/index.ts"', async (t: test.TestContext) => {
    const result = await transpiler.transform('/path/to/project/src/index.ts');
    t.assert.strictEqual(
        result.code,
        [
            `import { Elphis } from './lib/elphis/index.ts';`,
            `import { leon } from './leon.ts';`,
            `const elphis = new Elphis();`,
            `const success = elphis.curePatient(leon);`,
            `//# sourceMappingURL=index.js.map`,
        ].join('\n')
    );

    t.assert.deepStrictEqual(
        JSON.parse(result.map!),
        {
            "version": 3,
            "file": "index.js",
            "sourceRoot": "",
            "sources": [ "../src/index.ts" ],
            "names": [],
            "mappings": [
                "AAAA,OAAO,EAAE,MAAM,EAAE,8BAA6B;AAC9C,OAAO,EAAE,IAAI,EAAE,",
                "kBAAkB;AACjC,MAAM,MAAM,GAAG,IAAI,MAAM,EAAE,CAAC;AAC5B,MAAM,",
                "OAAO,GAAY,MAAM,CAAC,WAAW,CAAC,IAAI,CAAC,CAAC"
            ].join('')
        }
    );
});

test('Transpile "/path/to/project/src/lib/elphis/index.ts"', async (t: test.TestContext) => {
    const result = await transpiler.transform('/path/to/project/src/lib/elphis/index.ts');
    console.log(result.code);
    console.log();
    console.log(result.map);
    // t.assert.strictEqual(
    //     result.code,
    //     [
    //         `import { Elphis } from './lib/elphis/index.ts';`,
    //         `import { leon } from './leon.ts';`,
    //         `const elphis = new Elphis();`,
    //         `const success = elphis.curePatient(leon);`,
    //         `//# sourceMappingURL=index.js.map`,
    //     ].join('\n')
    // );

    // t.assert.deepStrictEqual(
    //     JSON.parse(result.map!),
    //     {
    //         "version": 3,
    //         "file": "index.js",
    //         "sourceRoot": "",
    //         "sources": [ "../src/index.ts" ],
    //         "names": [],
    //         "mappings": [
    //             "AAAA,OAAO,EAAE,MAAM,EAAE,8BAA6B;AAC9C,OAAO,EAAE,IAAI,EAAE,",
    //             "kBAAkB;AACjC,MAAM,MAAM,GAAG,IAAI,MAAM,EAAE,CAAC;AAC5B,MAAM,",
    //             "OAAO,GAAY,MAAM,CAAC,WAAW,CAAC,IAAI,CAAC,CAAC"
    //         ].join('')
    //     }
    // );
});