import type { TsconfigObject } from './tsconfig.object.ts';

export interface SWCPluginContext {
    srcPath: string;
    outPath?: string;
    tsconfig: TsconfigObject;
}