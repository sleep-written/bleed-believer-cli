import type { Config } from '@swc/core';

export interface TsconfigObject {
    path: string;
    json: {
        compilerOptions?: {
            outDir?: string;
            rootDir?: string;
        };
    };

    resolve(specifier: string): string[] | null;
    toSwcConfig(): Config;
}