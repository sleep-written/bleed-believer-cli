import type { Config, JscConfig, ModuleConfig } from '@swc/core';
import type { TsconfigJSON } from './interfaces/index.ts';

export function tsconfigToSwcrc(input: TsconfigJSON): Config {
    const compilerOptions = input.compilerOptions ?? {};
    let module: ModuleConfig;
    switch (compilerOptions.module) {
        case 'nodenext': {
            module = { type: 'nodenext' };
            if (compilerOptions.strict) {
                module.strict = true;
            }
            break;
        }

        case 'commonjs': {
            module = { type: 'commonjs' };
            if (compilerOptions.strict) {
                module.strict = true;
            }
            break;
        }

        case 'amd':
        case 'umd': {
            module = { type: 'umd' };
            if (compilerOptions.strict) {
                module.strict = true;
            }
            break;
        }

        case 'system': {
            module = { type: 'systemjs' };
            break;
        }

        default: {
            module = { type: 'es6' };
            if (compilerOptions.strict) {
                module.strict = true;
            }
            break;
        }
    }

    const jsc: JscConfig = {
        parser: {
            syntax: 'typescript',
            decorators: true
        },
        transform: {
            decoratorVersion: compilerOptions.experimentalDecorators
                ?   '2021-12'
                :   '2022-03',
        },
        preserveAllComments: !compilerOptions.removeComments
    };

    if (compilerOptions.paths) {
        jsc.paths = compilerOptions.paths;
    }

    if (compilerOptions.baseUrl) {
        jsc.baseUrl = compilerOptions.baseUrl;
    }

    if (compilerOptions.verbatimModuleSyntax) {
        jsc.transform!.verbatimModuleSyntax = compilerOptions.verbatimModuleSyntax;
    }

    if (compilerOptions.emitDecoratorMetadata) {
        jsc.transform!.decoratorMetadata = compilerOptions.emitDecoratorMetadata;
    }

    switch (compilerOptions.target) {
        case 'es6': {
            jsc.target = 'es2015';
            break;
        }

        case 'es3':
        case 'es5':
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
            jsc.target = compilerOptions.target! as any;
            break;
        }
    }

    return {
        jsc,
        module,
        sourceMaps: !!compilerOptions.sourceMap
    };
}