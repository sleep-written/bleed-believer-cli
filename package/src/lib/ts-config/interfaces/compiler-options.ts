import type { Target } from './target.js';
import type { Module } from './module.js';
import type { ModuleResolution } from './module-resolution.js';

export interface CompilerOptions {
    strict?: boolean;
    target?: Target;
    module?: Module;
    moduleResolution?: ModuleResolution;

    verbatimModuleSyntax?: boolean;
    emitDecoratorMetadata?: boolean;
    experimentalDecorators?: boolean;
    esModuleInterop?: boolean;
    removeComments?: boolean;

    outDir?: string;
    rootDir?: string;
    baseUrl?: string;
    sourceMap?: boolean;
    paths?: Record<string, string[]>;
}