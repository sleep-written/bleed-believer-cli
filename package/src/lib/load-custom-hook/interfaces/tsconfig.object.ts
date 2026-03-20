import type { Config } from '@swc/core';

export interface TsconfigObject {
    toSwcConfig(): Config;
}