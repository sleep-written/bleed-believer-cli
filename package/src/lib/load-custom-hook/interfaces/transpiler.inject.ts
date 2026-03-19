import type { Options, Output, Program } from '@swc/core';

export interface TranspilerInject {
    transform?(
        src: string | Program,
        options?: Options
    ): Promise<Output>;
}