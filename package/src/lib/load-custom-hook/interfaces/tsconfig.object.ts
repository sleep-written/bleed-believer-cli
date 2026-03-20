import type { Config } from '@swc/core';

export interface TsconfigObject {
    path: string;
    toSwcConfig(): Config;
}