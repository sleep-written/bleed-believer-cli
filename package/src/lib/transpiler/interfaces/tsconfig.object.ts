import type { CompilerOptions } from 'typescript';

export interface TsconfigObject {
    path: string;
    options: CompilerOptions;
}