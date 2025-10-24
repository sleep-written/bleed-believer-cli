import type { CompilerOptions } from './compiler-options.js';

export interface TSConfig {
    extends?: string | string[];
    exclude?: string[];
    compilerOptions?: CompilerOptions;
}