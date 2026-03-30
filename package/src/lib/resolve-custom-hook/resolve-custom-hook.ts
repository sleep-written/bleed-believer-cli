import type { ResolveFnOutput, ResolveHookContext, ResolveHook } from 'node:module';
import type { ResolveCustomHookInject, TsconfigObject } from './interfaces/index.ts';

import { dirname, resolve, sep } from 'node:path';
import { SourceFile } from '../source-file/index.ts';
import { isBuiltin } from 'node:module';

export class ResolveCustomHook {
    #tsconfig: TsconfigObject;
    #injected: Required<ResolveCustomHookInject>;
    #rootDir: string;
    #outDir: string;
    #cache = new Map<string, string>();

    constructor(tsconfig: TsconfigObject, inject?: ResolveCustomHookInject) {
        this.#tsconfig = tsconfig;
        this.#injected = {
            dirname:    inject?.dirname?.bind(inject)   ?? dirname,
            resolve:    inject?.resolve?.bind(inject)   ?? resolve,
            sep:        inject?.sep                     ?? sep,
        };

        this.#rootDir = this.#injected.resolve(
            this.#injected.dirname(tsconfig.path),
            tsconfig.json.compilerOptions?.rootDir ?? '.'
        ) + this.#injected.sep;

        this.#outDir = this.#injected.resolve(
            this.#injected.dirname(tsconfig.path),
            tsconfig.json.compilerOptions?.outDir ?? '.'
        ) + this.#injected.sep;
    }

    async resolve(
        specifier: string,
        context: ResolveHookContext,
        defaultResolve: Parameters<ResolveHook>[2]
    ): Promise<ResolveFnOutput> {
        if (this.#cache.has(specifier)) {
            const cachedSpecifier = this.#cache.get(specifier)!;
            return defaultResolve(cachedSpecifier, context);
        }

        if (isBuiltin(specifier) || typeof context.parentURL !== 'string') {
            this.#cache.set(specifier, specifier);
            return defaultResolve(specifier, context);
        }

        const parentFile = new SourceFile(context.parentURL);
        const insideRoot = parentFile.path.startsWith(this.#rootDir);
        const insideOut = parentFile.path.startsWith(this.#outDir);
        const paths = this.#tsconfig.resolve(specifier) ?? [];
        paths.push(this.#injected.resolve(parentFile.dirname, specifier));

        for (const path of paths) {
            if (insideRoot) {
                const resolved = path.replace(this.#outDir, this.#rootDir);
                const file = new SourceFile(resolved).toTsExt();
                if (await file.exists()) {
                    this.#cache.set(specifier, file.url.href);
                    return defaultResolve(file.url.href, context);
                }

            } else if (insideOut) {
                const resolved = path.replace(this.#rootDir, this.#outDir);
                const file = new SourceFile(resolved).toJsExt();
                if (await file.exists()) {
                    this.#cache.set(specifier, file.url.href);
                    return defaultResolve(file.url.href, context);
                }

            }
        }

        this.#cache.set(specifier, specifier);
        return defaultResolve(specifier, context);
    }
}