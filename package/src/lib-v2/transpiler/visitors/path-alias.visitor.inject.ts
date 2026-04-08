import type { CompilerOptions } from 'typescript';

export interface TsconfigObject {
    path: string;
    options: CompilerOptions;
}

export interface PathAliasObject {
    resolve(
        specifier: string,
        pathOrFileURL: string
    ): string;
}

export interface PathAliasVisitorInject {
    pathAlias?: new(tsconfig: TsconfigObject) => PathAliasObject;
}