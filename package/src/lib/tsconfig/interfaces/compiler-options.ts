import type { CompilerOptionsModuleResolution } from './compiler-options.module-resolution.ts';
import type { CompilerOptionsModule } from './compiler-options.module.ts';
import type { CompilerOptionsTarget } from './compiler-options.target.ts';

export interface CompilerOptions {
    module?: CompilerOptionsModule;
    target?: CompilerOptionsTarget;
    moduleResolution?: CompilerOptionsModuleResolution;

    strict?: boolean;
    noEmit?: boolean;
    sourceMap?: boolean;
    removeComments?: boolean;
    resolveJsonModule?: boolean;
    emitDeclarationOnly?: boolean;
    verbatimModuleSyntax?: boolean;
    emitDecoratorMetadata?: boolean;
    experimentalDecorators?: boolean;
    allowImportingTsExtensions?: boolean;

    paths?: Record<string, string[]>;
    outDir?: string;
    rootDir?: string;
    baseUrl?: string;
}