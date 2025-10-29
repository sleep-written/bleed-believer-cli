import type { TSConfigLoadInject, TsConfigValue } from './interfaces/index.js';

import { targetPathResolve } from './target-path-resolve.js';
import { tsConfigMerger } from './ts-config.merger.js';
import { TSConfig } from './ts-config.js';

import { access, readFile } from 'fs/promises';
import JSON5 from 'json5';

export async function tsConfigLoad(target?: string | null, inject?: TSConfigLoadInject): Promise<TSConfig> {
    const accessFn =   inject?.access   ?? access;
    const readFileFn = inject?.readFile ?? readFile;

    let tsConfig: TsConfigValue = {
        exclude: [ 'node_modules' ],
        compilerOptions: {
            target: 'esnext',
            module: 'nodenext',
            moduleResolution: 'nodenext'
        }
    };

    if (typeof target !== 'string') {
        target = targetPathResolve(target, inject);
        try {
            await accessFn(target);
        } catch (err: any) {
            return new TSConfig(tsConfig);
        }
    } else {
        target = targetPathResolve(target, inject);
    }

    const jsonPaths: string[] = [ target ];
    const jsonFiles: TsConfigValue[] = [];

    while (jsonPaths.length > 0) {
        const path = jsonPaths.shift()!;
        if (jsonPaths.includes(path)) {
            throw new Error(`The path "${path}" was already readed`);
        }

        const text = await readFileFn(path, 'utf-8');
        const json = JSON5.parse(text) as TsConfigValue;
        jsonFiles.push(json);

        if (json.extends instanceof Array) {
            jsonPaths.push(...json.extends);
        } else if (typeof json.extends === 'string') {
            jsonPaths.push(json.extends);
        }
    }

    for (const json of jsonFiles) {
        tsConfig = tsConfigMerger.merge(json, tsConfig);
    }

    return new TSConfig(tsConfig, { process: inject?.process });
}