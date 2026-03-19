import type { ResolveFnOutput, ResolveHookContext, ResolveHook } from 'node:module';
import type { ResolveCustomHookInject, TsconfigObject } from './interfaces/index.ts';

import { pathToFileURL } from 'node:url';
import { access } from 'node:fs/promises';

export class ResolveCustomHook {
    #tsconfig: TsconfigObject;
    #injected: Required<ResolveCustomHookInject>;
    #cache = new Map<string, string>();

    constructor(tsconfig: TsconfigObject, inject?: ResolveCustomHookInject) {
        this.#tsconfig = tsconfig;
        this.#injected = {
            access: access?.bind(inject)    ?? inject
        };
    }

    async resolve(
        specifier: string,
        context: ResolveHookContext,
        defaultLoad: Parameters<ResolveHook>[2]
    ): Promise<ResolveFnOutput> {
        if (this.#cache.has(specifier)) {
            const spec = this.#cache.get(specifier)!;
            return defaultLoad(spec, context);
        }

        const paths = this.#tsconfig.resolve(specifier);
        if (paths) {
            for (const path of paths) {
                try {
                    await this.#injected.access(path);
                    const url = pathToFileURL(path).href;
                    this.#cache.set(specifier, url);
                    return defaultLoad(url, context);
                } catch {
                    continue;
                }
            }
        }

        return defaultLoad(specifier, context);
    }
}