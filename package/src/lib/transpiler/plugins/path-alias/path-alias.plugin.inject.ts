import type { TsconfigObject } from '../../interfaces/index.ts';

export interface PathAliasObject {
    resolve(
        specifier: string,
        pathOrFileURL: string
    ): string;
}

export interface PathAliasPluginInject {
    pathAlias: new(
        tsconfig: TsconfigObject,
        toJs: boolean
    ) => PathAliasObject;
}