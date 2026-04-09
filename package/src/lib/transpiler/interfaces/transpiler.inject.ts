import type { CompilerOptions, ResolutionMode, ModuleResolutionHost, PackageJsonInfoCache } from 'typescript';
import type { ParsedPath } from 'node:path';

export interface TranspilerInject {
    getImpliedNodeFormatForFile?(
        filename: string,
        packageJsonInfoCache: PackageJsonInfoCache | undefined,
        host: ModuleResolutionHost,
        options: CompilerOptions
    ): ResolutionMode;

    readFile?(path: string, encoding: BufferEncoding): Promise<string>;
    resolve?(...p: string[]): string;
    dirname?(path: string): string;
    parse?(path: string): ParsedPath;
    sep?: string;
}