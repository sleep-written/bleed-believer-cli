import type { ParseArgsConfig, ParseArgsOptionDescriptor } from 'node:util';

export interface ArgvSettings extends Pick<
    ParseArgsConfig,
    'strict' | 'allowNegative'
> {
    positionals: string[];
    info?: string;
    options?: Record<string, ParseArgsOptionDescriptor & { info?: string }>
}