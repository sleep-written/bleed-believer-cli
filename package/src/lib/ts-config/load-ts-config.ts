import type { TSConfig, LoadTSConfigInject } from './interfaces/index.js';

import { targetPathResolve } from './target-path-resolve.js';
import { tsConfigMerger } from './tsconfig.merger.js';

import fsPromises from 'fs/promises';
import process from 'process';
import JSON5 from 'json5';
import path from 'path';

export async function loadTSConfig(target?: string | null, inject?: LoadTSConfigInject): Promise<TSConfig> {
    const processObj = inject?.process  ?? process;
    const readFileFn = inject?.readFile ?? fsPromises.readFile;

    const jsonPaths = [ targetPathResolve(target, inject) ];
    const jsonFiles: TSConfig[] = [];
    const usedPaths: string[] = [];
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

    // Default configuration
    let tsConfig: TSConfig = {
        compilerOptions: {
            target: 'esnext',
            module: 'nodenext',
            moduleResolution: 'nodenext'
        }
    };

    for (const jsonFile of jsonFiles.reverse()) {
        tsConfig = tsConfigMerger.merge(jsonFile, tsConfig);
    }

    return tsConfig;
}