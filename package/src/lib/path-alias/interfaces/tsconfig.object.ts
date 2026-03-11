import type { CompilerOptions } from '../../tsconfig/index.ts';

export interface TsconfigObject {
    path: string;
    extends?: TsconfigObject[];
    compilerOptions?: CompilerOptions;
}