import type { TsconfigObject } from './interfaces/index.ts';
import { posix } from 'node:path';

export class PathAlias {
    #tsconfig: TsconfigObject;

    constructor(tsconfig: TsconfigObject) {
        this.#tsconfig = tsconfig;
    }

    resolve(specifier: string): string[] | null {
        return this.#searchPaths(this.#tsconfig, specifier);
    }

    #searchPaths(tsconfig: TsconfigObject, specifier: string): string[] | null {
        const paths = tsconfig.compilerOptions?.paths;
        if (paths) {
            for (const [pattern, mappings] of Object.entries(paths)) {
                const resolved = this.#matchPattern(specifier, pattern, mappings, tsconfig);
                if (resolved) return resolved;
            }
        }

        for (const ext of tsconfig.extends ?? []) {
            const result = this.#searchPaths(ext, specifier);
            if (result) return result;
        }

        return null;
    }

    #matchPattern(
        specifier: string,
        pattern: string,
        mappings: string[],
        tsconfig: TsconfigObject
    ): string[] | null {
        const wildcardIndex = pattern.indexOf('*');
        let wildcard: string;

        if (wildcardIndex === -1) {
            if (specifier !== pattern) return null;
            wildcard = '';
        } else {
            const prefix = pattern.slice(0, wildcardIndex);
            const suffix = pattern.slice(wildcardIndex + 1);
            if (!specifier.startsWith(prefix)) return null;
            if (suffix && !specifier.endsWith(suffix)) return null;
            wildcard = specifier.slice(prefix.length, suffix ? specifier.length - suffix.length : undefined);
        }

        const tsconfigPath = tsconfig.path.replace(/\\/g, '/');
        const tsconfigDir = posix.dirname(tsconfigPath);
        const base = tsconfig.compilerOptions?.baseUrl
            ? posix.join(tsconfigDir, tsconfig.compilerOptions.baseUrl)
            : tsconfigDir;

        return mappings.map(m => {
            const mapped = wildcardIndex === -1 ? m : m.replace('*', wildcard);
            const resolved = posix.join(base, mapped);
            return this.#toResult(resolved);
        });
    }

    #toResult(path: string): string {
        const normalized = path.replace(/\\/g, '/');
        return normalized.startsWith('/')
            ? `file://${normalized}`
            : `file:///${normalized}`;
    }
}