import type { LoadHook, ResolveHook } from 'node:module';
import { AliasResolver } from './lib/alias-resolver/index.ts';
import { Tsconfig } from './lib/tsconfig/index.ts';

const tsconfig = await Tsconfig.load('tsconfig.json');
const resolver = new AliasResolver(tsconfig);

export const load: LoadHook = (url, context, defaultLoad) => {
    console.log(`load hook:\nurl: ${url}\ncontext: ${context}`);
    return defaultLoad(url, context);
}

export const resolve: ResolveHook = (specifier, context, defaultResolve) => {
    console.log(`resolve hook:\nspecifier: ${specifier}\ncontext: ${context}`);

    const resolvedSpecifier = resolver.resolve(specifier)?.[0] ?? specifier;
    return defaultResolve(resolvedSpecifier, context);
}