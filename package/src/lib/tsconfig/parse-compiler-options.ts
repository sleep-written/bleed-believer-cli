import type { CompilerOptionsModuleResolution, CompilerOptionsModule, CompilerOptionsTarget, CompilerOptions } from './interfaces/index.ts';

export function parseCompilerOptions(o: any): CompilerOptions {
    const out: CompilerOptions = {};
    if (o && typeof o === 'object') {
        const raw = o as Required<CompilerOptions>;
        const rawTarget = raw.target?.toLowerCase() as CompilerOptionsTarget;
        switch (rawTarget) {
            case 'es3':
            case 'es5':
            case 'es6':
            case 'es2015':
            case 'es2016':
            case 'es2017':
            case 'es2018':
            case 'es2019':
            case 'es2020':
            case 'es2021':
            case 'es2022':
            case 'es2023':
            case 'es2024':
            case 'esnext': {
                out.target = rawTarget;
            }
        }

        const rawModule = raw.module?.toLowerCase() as CompilerOptionsModule;
        switch (rawModule) {
            case 'none':
            case 'commonjs':
            case 'amd':
            case 'umd':
            case 'system':
            case 'es6':
            case 'es2015':
            case 'es2020':
            case 'es2022':
            case 'esnext':
            case 'node16':
            case 'node18':
            case 'node20':
            case 'nodenext':
            case 'preserve': {
                out.module = rawModule;
            }
        }

        const rawModuleResolution = raw.moduleResolution?.toLowerCase() as CompilerOptionsModuleResolution;
        switch (rawModuleResolution) {
            case 'classic':
            case 'node':
            case 'node10':
            case 'node16':
            case 'nodenext':
            case 'bundler': {
                out.moduleResolution = rawModuleResolution;
            }
        }

        if (typeof raw.strict === 'boolean') {
            out.strict = raw.strict;
        }

        if (typeof raw.noEmit === 'boolean') {
            out.noEmit = raw.noEmit;
        }

        if (typeof raw.sourceMap === 'boolean') {
            out.sourceMap = raw.sourceMap;
        }

        if (typeof raw.emitDeclarationOnly === 'boolean') {
            out.emitDeclarationOnly = raw.emitDeclarationOnly;
        }

        if (typeof raw.verbatimModuleSyntax === 'boolean') {
            out.verbatimModuleSyntax = raw.verbatimModuleSyntax;
        }

        if (typeof raw.emitDecoratorMetadata === 'boolean') {
            out.emitDecoratorMetadata = raw.emitDecoratorMetadata;
        }

        if (typeof raw.experimentalDecorators === 'boolean') {
            out.experimentalDecorators = raw.experimentalDecorators;
        }

        if (typeof raw.allowImportingTsExtensions === 'boolean') {
            out.allowImportingTsExtensions = raw.allowImportingTsExtensions;
        }

        if (typeof raw.outDir === 'string') {
            out.outDir = raw.outDir;
        }

        if (typeof raw.rootDir === 'string') {
            out.rootDir = raw.rootDir;
        }

        if (typeof raw.baseUrl === 'string') {
            out.baseUrl = raw.baseUrl;
        }

        if (raw.paths && typeof raw.paths === 'object') {
            for (const [ k, v ] of Object.entries(raw.paths)) {
                if (v instanceof Array || typeof v === 'string') {
                    if (!out.paths) {
                        out.paths = {};
                    }

                    out.paths[k] = v instanceof Array
                    ?   v.filter(x => typeof x === 'string')
                    :   [ v ];
                }
            }
        }
    }

    return out;
}