import type { SWCPluginContext } from './swc-plugin.context.ts';
import type { Program } from '@swc/core';

export interface SWCPlugin {
    transform(
        program: Program,
        context: SWCPluginContext
    ): Program;
}