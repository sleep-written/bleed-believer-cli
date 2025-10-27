import type { Config as SWCConfig } from '@swc/core';
import type { TSConfig } from './interfaces/index.js';

export function toSWCConfig(tsConfig: TSConfig): SWCConfig {
    const swcConfig: SWCConfig = {
        jsc: {
            target: tsConfig?.compilerOptions?.target !== 'es6'
                ?   tsConfig?.compilerOptions?.target ?? 'esnext'
                :   'es2015',
            preserveAllComments: !tsConfig?.compilerOptions?.removeComments,
            transform: {
                decoratorMetadata: !!tsConfig?.compilerOptions?.emitDecoratorMetadata,
                decoratorVersion: tsConfig?.compilerOptions?.experimentalDecorators
                ?   '2021-12'
                :   '2022-03',
                verbatimModuleSyntax: !!tsConfig?.compilerOptions?.verbatimModuleSyntax,
                legacyDecorator: tsConfig?.compilerOptions?.moduleResolution === 'classic'
            },
            parser: {
                syntax: 'typescript',
                decorators: true
            },
            output: { charset: 'utf8' }
        },
        sourceMaps: !!tsConfig?.compilerOptions?.sourceMap
    };

    if (tsConfig?.exclude instanceof Array) {
        swcConfig.exclude = tsConfig.exclude.slice();
    }

    if (typeof tsConfig?.compilerOptions?.baseUrl === 'string') {
        swcConfig.jsc!.baseUrl = tsConfig.compilerOptions.baseUrl;
    }

    if (tsConfig?.compilerOptions?.paths != null) {
        const entries = Object
            .entries(tsConfig.compilerOptions.paths)
            .map(([ k, v ]) => [ k, v.slice() ]);

        swcConfig.jsc!.paths = Object.fromEntries(entries);
    }

    switch (tsConfig?.compilerOptions?.module) {
        case 'system': {
            swcConfig.module = {
                type: 'systemjs',
                allowTopLevelThis: true
            };
            break;
        }

        case 'nodenext': {
            const type = tsConfig?.compilerOptions?.module as 'commonjs' | 'amd' | 'umd' | 'nodenext';
            swcConfig.module = {
                type,
                strict: !!tsConfig?.compilerOptions?.strict,
                strictMode: !!tsConfig?.compilerOptions?.strict,
                resolveFully: true,
                allowTopLevelThis: true,
                exportInteropAnnotation: true,
                importInterop: tsConfig?.compilerOptions?.moduleResolution === 'bundler'
                    ?   'swc'
                    :   'node'
            };
            break;
        }

        default: {
            swcConfig.module = {
                type: 'es6',
                strict: !!tsConfig?.compilerOptions?.strict,
                strictMode: !!tsConfig?.compilerOptions?.strict,
                resolveFully: true,
                allowTopLevelThis: true,
                exportInteropAnnotation: true,
                importInterop: tsConfig?.compilerOptions?.moduleResolution === 'bundler'
                    ?   'swc'
                    :   'node'
            };
        }
    }

    return swcConfig;
}