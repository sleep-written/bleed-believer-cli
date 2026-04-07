import type { TsconfigObject, VisitorObject } from './interfaces/index.ts';

import { factory, isStringLiteral } from 'typescript';
import { Transpiler } from './transpiler.ts';
import { test } from 'node:test';

test('Use a simple visitor', (t: test.TestContext) => {
    const tsconfig: TsconfigObject = {
        path: '/path/to/project/tsconfig.json',
        options: {
            rootDir: '/path/to/project/src',
            outDir: '/path/to/project/dist',
            paths: {
                '@lib/*':   [ './src/lib/*' ],
                '@/*':      [ './src/*' ],
            }
        }
    };

    const visitor: VisitorObject = {
        accept: n => isStringLiteral(n),
        visit:  _ => factory.createStringLiteral('JODER')
    };

    const transpiler = new Transpiler(tsconfig, visitor);
    const result = transpiler.transform(
        '/path/to/project/src/index.ts',
        `console.log("hola mundo");`
    );

    t.assert.strictEqual(result, `console.log("JODER");\n`);
});