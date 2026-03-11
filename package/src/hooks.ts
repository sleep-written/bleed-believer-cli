import type { LoadHook, ResolveHook } from 'node:module';
import { AliasResolver } from './lib/alias-resolver/index.ts';
import { Tsconfig } from './lib/tsconfig/index.ts';
import { styleText } from 'node:util';

const tsconfig = await Tsconfig.load('tsconfig.json');
const resolver = new AliasResolver(tsconfig);

export const load: LoadHook = (url, context, defaultLoad) => {
    console.log(styleText('yellow', 'Load hook') + ':');
    console.log('----------');
    console.log('url:', url);
    console.log('context:', context);
    console.log('\n');

    return defaultLoad(url, context);
}

export const resolve: ResolveHook = (specifier, context, defaultResolve) => {
    console.log(styleText('yellow', 'Resolve hook') + ':');
    console.log('-------------');
    console.log('specifier:', specifier);
    console.log('context:', context);
    console.log('\n');

    const resolvedSpecifier = resolver.resolve(specifier)?.[0] ?? specifier;
    return defaultResolve(resolvedSpecifier, context);
}