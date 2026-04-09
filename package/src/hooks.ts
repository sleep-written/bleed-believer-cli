import type { LoadHook, LoadFnOutput } from 'node:module';

import { Transpiler, PathAliasPlugin } from './lib/transpiler/index.ts';
import { fileURLToPath } from 'node:url';
import { Tsconfig } from './lib/tsconfig/index.ts';
import { resolve } from 'node:path';

const tsconfigPath = resolve(
    process.env['BLEED-BELIEVER-CLI-TSCONFIG'] ??
    'tsconfig.json'
);

const tsconfig = Tsconfig.load(tsconfigPath);
const transpiler = new Transpiler(tsconfig, [
    new PathAliasPlugin(tsconfig, false)
]);

const cache = new Map<string, LoadFnOutput>();
export const load: LoadHook = async (url, context, defaultLoad) => {
    if (cache.has(url)) {
        return cache.get(url)!;
    }

    const path = url.startsWith('file://')
    ?   fileURLToPath(url)
    :   url;

    if (/\.(?:m|c)?tsx?$/.test(url)) {
        try {
            const { code } = await transpiler.transpile(path);
            const out: LoadFnOutput = {
                shortCircuit: true,
                format: 'module',
                source: code
            };

            cache.set(url, out);
            return out;
        } catch (err) {
            console.error(err);
            throw err;
        }

    } else {
        return defaultLoad(url, context);
    }
}