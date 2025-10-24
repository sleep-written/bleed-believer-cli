import type { TSConfig } from './interfaces/index.js';

export function mergeTSConfig(...files: [ TSConfig, ...TSConfig[] ]): TSConfig {
    const tsConfig: TSConfig = {};
    for (const json of files) {
        if (tsConfig.extends instanceof Array) {
            if (json.extends instanceof Array) {
                tsConfig.extends.push(...json.extends);
            } else if (typeof json.extends === 'string') {
                tsConfig.extends.push(json.extends);
            }

        } else if (typeof tsConfig.extends === 'string') {
            if (json.extends instanceof Array) {
                tsConfig.extends = [
                    tsConfig.extends,
                    ...json.extends
                ];
            } else if (typeof json.extends === 'string') {
                tsConfig.extends = [
                    tsConfig.extends,
                    ...json.extends
                ];
            }
        }

        if (json.exclude instanceof Array) {
            tsConfig.exclude?.push(...json.exclude);
        }

        if (json.compilerOptions) {
            if (!tsConfig.compilerOptions) {
                tsConfig.compilerOptions = {};
            }
            
            if (typeof json.compilerOptions.strict === 'boolean') {
                tsConfig.compilerOptions.strict = json.compilerOptions.strict;
            }
            
            if (typeof json.compilerOptions.target === 'string') {
                tsConfig.compilerOptions.target = json.compilerOptions.target;
            }
            
            if (typeof json.compilerOptions.module === 'string') {
                tsConfig.compilerOptions.module = json.compilerOptions.module;
            }
            
            if (typeof json.compilerOptions.moduleResolution === 'string') {
                tsConfig.compilerOptions.moduleResolution = json.compilerOptions.moduleResolution;
            }
            
            if (typeof json.compilerOptions.verbatimModuleSyntax === 'boolean') {
                tsConfig.compilerOptions.verbatimModuleSyntax = json.compilerOptions.verbatimModuleSyntax;
            }
            
            if (typeof json.compilerOptions.emitDecoratorMetadata === 'boolean') {
                tsConfig.compilerOptions.emitDecoratorMetadata = json.compilerOptions.emitDecoratorMetadata;
            }
            
            if (typeof json.compilerOptions.experimentalDecorators === 'boolean') {
                tsConfig.compilerOptions.experimentalDecorators = json.compilerOptions.experimentalDecorators;
            }
            
            if (typeof json.compilerOptions.esModuleInterop === 'boolean') {
                tsConfig.compilerOptions.esModuleInterop = json.compilerOptions.esModuleInterop;
            }
            
            if (typeof json.compilerOptions.removeComments === 'boolean') {
                tsConfig.compilerOptions.removeComments = json.compilerOptions.removeComments;
            }
            
            if (typeof json.compilerOptions.outDir === 'string') {
                tsConfig.compilerOptions.outDir = json.compilerOptions.outDir;
            }
            
            if (typeof json.compilerOptions.rootDir === 'string') {
                tsConfig.compilerOptions.rootDir = json.compilerOptions.rootDir;
            }
            
            if (typeof json.compilerOptions.baseUrl === 'string') {
                tsConfig.compilerOptions.baseUrl = json.compilerOptions.baseUrl;
            }
            
            if (typeof json.compilerOptions.sourceMap === 'boolean') {
                tsConfig.compilerOptions.sourceMap = json.compilerOptions.sourceMap;
            }
            
            if (json.compilerOptions.paths) {
                const paths: [ string, string[] ][] = [];

                Object
                    .entries(tsConfig.compilerOptions.paths ?? {})
                    .forEach(([ k, v ]) => {
                        paths.push([ k, v.slice() ]);
                    });

                Object
                    .entries(json.compilerOptions.paths ?? {})
                    .forEach(([ k, v ]) => {
                        const found = paths.find(([ key ]) => k === key);
                        if (found) {
                            found[1].push(...v);
                        } else {
                            paths.push([ k, v.slice() ]);
                        }
                    });

                tsConfig.compilerOptions.paths = Object.fromEntries(paths);
            }
        }
    }
    
    return tsConfig;
}