import type {
    TsconfigJSON, CompilerOptionsTarget, CompilerOptionsModule,
    CompilerOptionsModuleResolution,
    CompilerOptions
} from './interfaces/index.ts';

import { dirname, isAbsolute, resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import json5 from 'json5';

export interface LoadTsconfigJSONInject {
    isAbsolute?(
        path: string
    ): boolean;

    readFile?(
        path: string,
        encoding: BufferEncoding
    ): Promise<string>;

    resolve?(
        ...pathParths: string[]
    ): string;

    dirname?(
        path: string
    ): string;
}

export async function loadTsconfigJSON(path: string, inject?: LoadTsconfigJSONInject): Promise<TsconfigJSON> {
    const injected: Required<LoadTsconfigJSONInject> = {
        isAbsolute: inject?.isAbsolute?.bind(inject)    ?? isAbsolute,
        readFile:   inject?.readFile?.bind(inject)      ?? readFile,
        resolve:    inject?.resolve?.bind(inject)       ?? resolve,
        dirname:    inject?.dirname?.bind(inject)       ?? dirname,
    };

    if (!isAbsolute(path)) {
        path = injected.resolve(path);
    }

    const text = await injected.readFile(path, 'utf-8');
    const json = json5.parse(text) as TsconfigJSON & { extends?: (string | string[]) };

    let resp: TsconfigJSON = {};
    if (typeof json.extends === 'string') {
        json.extends = [ json.extends ];
    }

    if (Array.isArray(json.extends)) {
        for (const innerPath of json.extends) {
            const innerResolvedPath = injected.resolve(injected.dirname(path), innerPath);
            const innerJson = await loadTsconfigJSON(innerResolvedPath, inject);
            if (innerJson.compilerOptions) {
                resp.compilerOptions = {
                    ...innerJson.compilerOptions,
                    ...(resp.compilerOptions ?? {})
                };
            }

            if (Array.isArray(innerJson.include)) {
                resp.include = [
                    ...innerJson.include,
                    ...(resp.include ?? [])
                ];
            }

            if (Array.isArray(innerJson.exclude)) {
                resp.exclude = [
                    ...innerJson.exclude,
                    ...(resp.exclude ?? [])
                ];
            }
        }
    }

    if (Array.isArray(json.include)) {
        resp.include = [
            ...(resp.include ?? []),
            ...json.include
        ];
    }

    if (Array.isArray(json.exclude)) {
        resp.exclude = [
            ...(resp.exclude ?? []),
            ...json.exclude
        ];
    }

    if (json.compilerOptions && typeof json.compilerOptions === 'object') {
        if (!resp.compilerOptions) {
            resp.compilerOptions = {};
        }

        if (typeof json.compilerOptions.target === 'string') {
            const targetValue = json.compilerOptions.target.toLowerCase() as CompilerOptionsTarget;
            json.compilerOptions.target = targetValue;
        }

        switch (json.compilerOptions.target) {
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
                resp.compilerOptions.target = json.compilerOptions.target;
            }
        }

        if (typeof json.compilerOptions.module === 'string') {
            const moduleValue = json.compilerOptions.module.toLowerCase() as CompilerOptionsModule;
            json.compilerOptions.module = moduleValue;
        }

        switch (json.compilerOptions.module) {
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
                resp.compilerOptions.module = json.compilerOptions.module;
            }
        }

        if (typeof json.compilerOptions.moduleResolution === 'string') {
            const moduleResolutionValue = json.compilerOptions.moduleResolution.toLowerCase() as CompilerOptionsModuleResolution;
            json.compilerOptions.moduleResolution = moduleResolutionValue;
        }

        switch (json.compilerOptions.moduleResolution) {
            case 'classic':
            case 'node':
            case 'node10':
            case 'node16':
            case 'nodenext':
            case 'bundler': {
                resp.compilerOptions.moduleResolution = json.compilerOptions.moduleResolution;
            }
        }

        ([
            'strict',
            'noEmit',
            'sourceMap',
            'removeComments',
            'emitDeclarationOnly',
            'verbatimModuleSyntax',
            'emitDecoratorMetadata',
            'experimentalDecorators',
            'allowImportingTsExtensions',
        ] as (keyof CompilerOptions)[]).forEach(k => {
            if (
                resp?.compilerOptions &&
                json?.compilerOptions &&
                typeof json.compilerOptions[k] === 'boolean'
            ) {
                (resp.compilerOptions as any)[k] = json!.compilerOptions![k];
            }
        });

        ([
            'outDir',
            'rootDir',
            'baseUrl',
        ] as (keyof CompilerOptions)[]).forEach(k => {
            if (
                resp?.compilerOptions &&
                json?.compilerOptions &&
                typeof json.compilerOptions[k] === 'string'
            ) {
                (resp.compilerOptions as any)[k] = json!.compilerOptions![k];
            }
        });

        if (json.compilerOptions.paths && typeof json.compilerOptions.paths === 'object') {
            const paths: Record<string, string[]> = {};
            Object
                .entries(json.compilerOptions.paths)
                .forEach(([ k, v ]) => {
                    if (Array.isArray(v) && v.length > 0) {
                        paths[k] = v.filter(x => typeof x === 'string');
                    }
                });

            resp.compilerOptions.paths = paths;
        }
    }

    return resp;
}