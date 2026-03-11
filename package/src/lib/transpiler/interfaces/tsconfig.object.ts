import type { CompilerOptions } from '../../tsconfig/index.ts';

export interface TsconfigObject {
    extends?: TsconfigObject[];
    include?: string[];
    exclude?: string[];
    compilerOptions?: CompilerOptions;
}