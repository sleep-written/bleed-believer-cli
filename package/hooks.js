import { Tsconfig } from './lib/tsconfig/index.ts';
import { LoadCustomHook } from './lib/load-custom-hook/index.ts';
import { ResolveCustomHook } from './lib/resolve-custom-hook/index.ts';
const tsconfigPath = process.env['BLEED-BELIEVER-CLI-TSCONFIG'] ?? 'tsconfig.json';
const tsconfig = await Tsconfig.load(tsconfigPath);
const loadHook = new LoadCustomHook(tsconfig);
const resolveHook = new ResolveCustomHook(tsconfig);
export const load = (url, context, defaultLoad)=>{
    return loadHook.load(url, context, defaultLoad);
};
export const resolve = (specifier, context, defaultResolve)=>{
    return resolveHook.resolve(specifier, context, defaultResolve);
};
