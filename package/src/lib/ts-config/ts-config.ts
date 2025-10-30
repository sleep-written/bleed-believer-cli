import type { TsConfigValue, TSConfigLoadInject, TSConfigInject } from './interfaces/index.js';
import type { Config } from '@swc/core';

import { tsConfigToSWC } from './ts-config.to-swc.js';
import { tsConfigLoad } from './ts-config.load.js';

export class TSConfig {
    static async load(target?: string | null, inject?: TSConfigLoadInject): Promise<TSConfig> {
        const value = await tsConfigLoad(target, inject);
        return new TSConfig(value, {
            process: inject?.process
        });
    }

    #inject: Required<TSConfigInject>;
    #value: TsConfigValue;
    get value(): TsConfigValue {
        return structuredClone(this.#value);
    }

    constructor(value: TsConfigValue, inject?: TSConfigInject) {
        this.#value = value;
        this.#inject = {
            process: inject?.process ?? process
        };
    }

    toSWC(): Config {
        return tsConfigToSWC(this.#value, this.#inject);
    }
}