import type { ResolveCustomHookInject, DefaultResolve } from './interfaces/index.js';
import type { ResolveHookContext } from 'module';
import type { TSConfig } from '@lib/ts-config/index.js';

import { pathToFileURL } from 'url';
import { ResolveCustomHook } from './resolve-custom-hook.js';
import test from 'ava';

const inject: ResolveCustomHookInject = {
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

const defaultResolve: DefaultResolve = (specifier) => {
    switch (specifier) {
        case'@tool/daemon/index.js':
        case'@tool/daemon/index.js': {
            throw new Error('Not found!');
        }

        default: {
            return { url: specifier };
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
        parentURL: pathToFileURL('/path/to/project/src/tool/satan/satan.ts').href,
        conditions: [],
        importAttributes: {}
    };

    const matcher = new ResolveCustomHook(tsConfig, inject);
    const result = await matcher.resolve('@tool/daemon/index.js', context, defaultResolve);
    t.is(result.url, '/path/to/project/src/tool/daemon/index.ts');
});

test('"@tool/daemon/index.js" → "/path/to/project/dist/tool/daemon/index.js"', async t => {
    const context: ResolveHookContext = {
        parentURL: pathToFileURL('/path/to/project/dist/tool/satan/satan.js').href,
        conditions: [],
        importAttributes: {}
    };

    const matcher = new ResolveCustomHook(tsConfig, inject);
    const result = await matcher.resolve('@tool/daemon/index.js', context, defaultResolve);
    t.is(result.url, '/path/to/project/dist/tool/daemon/index.js');
});