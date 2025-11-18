import type { LoadFSCacheInject, LoadFSCacheOptions } from './interfaces/index.js';

import { glob, readFile } from 'fs/promises';
import { createHash } from 'crypto';
import { resolve } from 'path';

export async function loadFSCache(
    pattern: string | string[],
    options?: LoadFSCacheOptions,
    inject?: LoadFSCacheInject
): Promise<Map<string, string>> {
    const createHashFn: LoadFSCacheInject['createHash'] = inject?.createHash?.bind(inject)  ?? createHash;
    const readFileFn:   LoadFSCacheInject['readFile']   = inject?.readFile?.bind(inject)    ?? readFile;
    const globFn:       LoadFSCacheInject['glob']       = inject?.glob?.bind(inject)        ?? glob;
    
    const iterator = globFn(pattern, {
        exclude: options?.exclude ?? [],
        withFileTypes: true
    });

    const cache = new Map<string, string>();
    for await (const dirent of iterator) {
        if (dirent.isFile()) {
            const path = resolve(dirent.parentPath, dirent.name);
            const code = await readFileFn(path);
            const hash = createHashFn(
                options?.algorithm ?? 'sha512',
                { outputLength: options?.outputLength }
            )
                .update(code)
                .digest('hex');

            cache.set(path, hash);
        }
    }

    return cache;
}