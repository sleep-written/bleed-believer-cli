import type { Program } from '@swc/core';

export interface SWCPlugin {
    transform(program: Program): Program;
}