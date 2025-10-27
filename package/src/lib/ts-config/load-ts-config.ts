import type { TSConfig, LoadTSConfigInject } from './interfaces/index.js';

import { mergeTSConfig } from './merge-ts-config.js';
import fsPromises from 'fs/promises';
import process from 'process';
import JSON5 from 'json5';
import path from 'path';

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

    const tsConfig = mergeTSConfig({}, ...jsonFiles.reverse());
    if (typeof tsConfig?.compilerOptions?.target === 'string') {
        tsConfig.compilerOptions.target = tsConfig.compilerOptions.target.toLowerCase() as any;
    }

    if (typeof tsConfig?.compilerOptions?.module === 'string') {
        tsConfig.compilerOptions.module = tsConfig.compilerOptions.module.toLowerCase() as any;
    }

    if (typeof tsConfig?.compilerOptions?.moduleResolution === 'string') {
        tsConfig.compilerOptions.moduleResolution = tsConfig.compilerOptions.moduleResolution.toLowerCase() as any;
    }

    return tsConfig;
}