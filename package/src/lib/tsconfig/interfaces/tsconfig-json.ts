import type { CompilerOptions } from './compiler-options.ts';

export interface TsconfigJSON {
    compilerOptions?: CompilerOptions;
    include?: string[];
    exclude?: string[];
}