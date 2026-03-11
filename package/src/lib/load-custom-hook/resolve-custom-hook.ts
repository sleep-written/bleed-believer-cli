import type { ResolveFnOutput, ResolveHookContext, ResolveHook } from 'node:module';
import type { ResolveCustomHookInject } from './interfaces/index.ts';

import { fileURLToPath } from 'node:url';
import { PathAlias } from './path-alias.ts';
import { access } from 'node:fs/promises';

export class ResolveCustomHook {
    #pathAlias: PathAlias;
    #injected: Required<ResolveCustomHookInject>;
    #cache = new Map<string, string>();

    constructor(pathAlias: PathAlias, inject?: ResolveCustomHookInject) {
        this.#pathAlias = pathAlias;
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

        const urls = this.#pathAlias.resolve(specifier);
        if (urls) {
            for (const url of urls) {
                try {
                    const path = fileURLToPath(url);
                    await this.#injected.access(path);

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