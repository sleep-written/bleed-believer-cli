import type { LoadHook, ResolveHook } from 'node:module';

import { ResolveCustomHook, PathAlias } from './lib/load-custom-hook/index.ts';
import { Tsconfig } from './lib/tsconfig/index.ts';

const tsconfig = await Tsconfig.load('tsconfig.json');
const resolveHook = new ResolveCustomHook(new PathAlias(tsconfig));

export const load: LoadHook = (url, context, defaultLoad) => {
    return defaultLoad(url, context);
}

export const resolve: ResolveHook = (specifier, context, defaultResolve) => {
    return resolveHook.resolve(specifier, context, defaultResolve);
}