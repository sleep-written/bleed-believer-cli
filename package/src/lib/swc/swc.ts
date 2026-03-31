import type { SWCPlugin, TsconfigObject, SWCInject, SWCPluginContext } from './interfaces/index.ts';
import { transform, type Config, type Options, type Output } from '@swc/core';
import { readFile } from 'fs/promises';
import { dirname, resolve, sep } from 'path';

export class SWC {
    #injected: Required<SWCInject>;
    #tsconfig: TsconfigObject;
    #plugins: SWCPlugin[];
    #config: Config;

    constructor(tsconfig: TsconfigObject, plugins?: SWCPlugin[], inject?: SWCInject) {
        this.#tsconfig = tsconfig;
        this.#injected = {
            readFile:   inject?.readFile?.bind(inject)  ?? readFile,
            dirname:    inject?.dirname?.bind(inject)   ?? dirname,
            resolve:    inject?.resolve?.bind(inject)   ?? resolve,
            sep:        inject?.sep                     ?? sep
        };

        this.#plugins = plugins ?? [];
        this.#config = tsconfig.toSwcConfig();
    }

    async transform(srcPath: string, outPath?: string): Promise<Output> {
        const context: SWCPluginContext = { srcPath, outPath, tsconfig: this.#tsconfig };
        const options: Options = {
            ...this.#config,
            outputPath: outPath,
            filename: srcPath,
            cwd: this.#injected.dirname(this.#tsconfig.path),

            plugin: program => {
                for (const plugin of this.#plugins) {
                    program = plugin.transform(program, context);
                }

                return program;
            }
        };

        const src = await this.#injected.readFile(srcPath, 'utf-8');
        return transform(src, options);
    }
}