import type { SpecifierMatcherInject, ResolveHookContext } from './interfaces/index.js';
import type { TSConfig } from '@lib/ts-config/index.js';

import { SpecifierMatcher } from './specifier-matcher.js';
import { pathToFileURL } from 'url';
import test from 'ava';

const inject: SpecifierMatcherInject = {
    process: {
        cwd: () => '/path/to/project'
    },
    access: async path => {
        switch (path) {
            case '/path/to/project/src/tool/daemon/index.ts':
            case '/path/to/project/dist/tool/daemon/index.js': {
                return;
            }

            default: {
                throw new Error(`The file "${path}" doesn't exists`);
            }
        }
    }
};

const tsConfig: TSConfig = {
    compilerOptions: {
        outDir: 'dist',
        baseUrl: 'src',
        rootDir: 'src',

        paths: {
            '@tool/*': [ 'tool/*' ]
        }
    }
};

test('"@tool/daemon/index.js" → "/path/to/project/src/tool/daemon/index.ts"', async t => {
    const context: ResolveHookContext = {
        parentURL: pathToFileURL('/path/to/project/src/tool/satan/satan.ts').href
    };

    const matcher = new SpecifierMatcher(tsConfig, inject);
    const result = await matcher.find('@tool/daemon/index.js', context);
    t.is(result, '/path/to/project/src/tool/daemon/index.ts');
});

test('"@tool/daemon/index.js" → "/path/to/project/dist/tool/daemon/index.js"', async t => {
    const context: ResolveHookContext = {
        parentURL: pathToFileURL('/path/to/project/dist/tool/satan/satan.js').href
    };

    const matcher = new SpecifierMatcher(tsConfig, inject);
    const result = await matcher.find('@tool/daemon/index.js', context);
    t.is(result, '/path/to/project/dist/tool/daemon/index.js');
});