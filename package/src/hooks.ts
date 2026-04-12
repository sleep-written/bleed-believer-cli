import type { LoadHook, LoadFnOutput } from 'node:module';

import { resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Transpiler, PathAliasPlugin } from './lib/transpiler/index.ts';
import { Tsconfig } from './lib/tsconfig/index.ts';

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
            const { code, map } = await transpiler.transpile(path);
            let source = code;
            if (map) {
                const mapObj = JSON.parse(map);
                mapObj.sources = [ basename(path) ];
                mapObj.sourceRoot = '';
                const base64Map = Buffer
                    .from(JSON.stringify(mapObj))
                    .toString('base64');

                source = code.replace(/\/\/# sourceMappingURL=\S+$/m, '');
                source += `\n//# sourceMappingURL=data:application/json;base64,${base64Map}`;
            }

            const out: LoadFnOutput = {
                shortCircuit: true,
                format: 'module',
                source
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