import type { PathAliasInject } from './path-alias.inject.ts';
import type { TargetFileObject } from './target-file.object.ts';
import type { TsconfigObject } from './tsconfig.object.ts';

export type TargetFileConstructor = new(
    pathOrFileURL: string,
    tsconfig: TsconfigObject,
    inject?: PathAliasInject
) => TargetFileObject;