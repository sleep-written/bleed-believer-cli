import type { TSConfig, LoadTSConfigInject, Target, Module, ModuleResolution } from './interfaces/index.js';

import { Merger } from '@lib/merger/index.js';
import fsPromises from 'fs/promises';
import process from 'process';
import JSON5 from 'json5';
import path from 'path';

const merger = new Merger<TSConfig>({
    compilerOptions: new Merger({
        strict:                 new Merger<boolean>(),
        target:                 new Merger<Target>(c => c?.toLowerCase() as Target),
        module:                 new Merger<Module>(c => c?.toLowerCase() as Module),
        moduleResolution:       new Merger<ModuleResolution>(c => c?.toLowerCase() as ModuleResolution),

        verbatimModuleSyntax:   new Merger<boolean>(),
        emitDecoratorMetadata:  new Merger<boolean>(),
        experimentalDecorators: new Merger<boolean>(),
        esModuleInterop:        new Merger<boolean>(),
        removeComments:         new Merger<boolean>(),

        outDir:                 new Merger<string>(),
        rootDir:                new Merger<string>(),
        baseUrl:                new Merger<string>(),
        sourceMap:              new Merger<boolean>(),
        paths:                  new Merger<Record<string, string[]>>((incoming, original) => {
            const out: Record<string, string[]> = {};

            Object
                .entries(original ?? {})
                .forEach(([ k, v ]) => { out[k] = v.slice() });

            Object
                .entries(incoming)
                .forEach(([ k, v ]) => {
                    if (out[k] instanceof Array) {
                        out[k] = [
                            ...out[k],
                            ...v
                        ];
                    } else {
                        out[k] = v.slice();
                    }
                });

            return out;
        })
    })
});

export async function loadTSConfig(target?: string | null, inject?: LoadTSConfigInject): Promise<TSConfig> {
    const processObj = inject?.process  ?? process;
    const readFileFn = inject?.readFile ?? fsPromises.readFile;

    const jsonPaths = [ target ?? 'tsconfig.json' ];
    const usedPaths: string[] = [];
    const jsonFiles: TSConfig[] = [];
    let cwd = processObj.cwd();

    while (jsonPaths.length > 0) {
        let jsonPath = jsonPaths.shift()!;
        if (!path.isAbsolute(jsonPath)) {
            jsonPath = path.resolve(cwd, jsonPath);
        }

        if (!jsonPath.toLowerCase().endsWith('.json')) {
            jsonPath = path.resolve(jsonPath, 'tsconfig.json');
        }

        if (usedPaths.includes(jsonPath)) {
            throw new Error(`The configuration file "${jsonPath}" is already merged`);
        } else {
            usedPaths.push(jsonPath);
        }

        cwd = path.dirname(jsonPath);
        const text = await readFileFn(jsonPath, 'utf-8');
        const json = JSON5.parse(text) as TSConfig;

        if (json?.extends instanceof Array) {
            jsonPaths.push(...json.extends);
        } else if (typeof json?.extends === 'string') {
            jsonPaths.push(json.extends);
        }

        if (json?.extends) {
            delete json.extends;
        }

        jsonFiles.push(json);
    }

    let tsConfig: TSConfig = {};
    for (const jsonFile of jsonFiles.reverse()) {
        tsConfig = merger.merge(jsonFile, tsConfig);
    }

    return tsConfig;
}