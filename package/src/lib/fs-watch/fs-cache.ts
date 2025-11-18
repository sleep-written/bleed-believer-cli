import type { LoadFSCacheInject, LoadFSCacheOptions, FSCacheDiff } from './interfaces/index.js';

import { loadFSCache } from './load-fs-cache.js';

export class FSCache {
    static async load(
        pattern: string | string[],
        options?: LoadFSCacheOptions,
        inject?: LoadFSCacheInject
    ): Promise<FSCache> {
        const cache = await loadFSCache(pattern, options, inject);
        return new FSCache(cache);
    }

    #cache: Map<string, string>;

    constructor(o?: Map<string, string> | Record<string, string>) {
        this.#cache = !(o instanceof Map)
        ?   new Map(Object.entries(o ?? {}))
        :   o;
    }

    diff(newerCache: FSCache): FSCacheDiff {
        const diff: FSCacheDiff = {
            created: [],
            updated: [],
            deleted: []
        };

        for (const [ path, hash ] of this.#cache.entries()) {
            const newerHash = newerCache.#cache.get(path);
            if (typeof newerHash !== 'string') {
                diff.deleted.push(path);
            } else if (hash !== newerHash) {
                diff.updated.push(path);
            }

        }

        for (const path of newerCache.#cache.keys()) {
            if (!this.#cache.has(path)) {
                diff.created.push(path);
            }
        }

        return diff;
    }

    toJSON(): Record<string, string> {
        return Object.fromEntries(this.#cache.entries());
    }
}