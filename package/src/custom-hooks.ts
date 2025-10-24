import type { LoadHook, ResolveHook } from 'module';
import { loadTSConfig } from '@lib/ts-config/index.js';
import { HookManager } from '@lib/hook-manager/index.js';

let hookManager: HookManager;
export const load: LoadHook = async (url, context, defaultLoad) => {
    if (!hookManager) {
        const tsConfig = await loadTSConfig();
        hookManager = new HookManager(tsConfig)
    }

    return hookManager.load(url, context, defaultLoad);
}

export const resolve: ResolveHook = async (specifier, context, defaultResolve) => {
    if (!hookManager) {
        const tsConfig = await loadTSConfig();
        hookManager = new HookManager(tsConfig)
    }

    return hookManager.resolve(specifier, context, defaultResolve);
}