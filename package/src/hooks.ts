import type { LoadHook, ResolveHook } from 'node:module';

import { Tsconfig } from './lib/tsconfig/index.ts';
import { LoadCustomHook } from './lib/load-custom-hook/index.ts';
import { ResolveCustomHook } from './lib/resolve-custom-hook/index.ts';

const tsconfig = await Tsconfig.load('tsconfig.json');
const resolveHook = new ResolveCustomHook(tsconfig);

// export const load: LoadHook = (url, context, defaultLoad) => {
//     return loadHook.load(url, context, defaultLoad);
// }

export const resolve: ResolveHook = (specifier, context, defaultResolve) => {
    return resolveHook.resolve(specifier, context, defaultResolve);
}