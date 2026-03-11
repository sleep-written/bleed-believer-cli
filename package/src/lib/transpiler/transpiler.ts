import type { TsconfigObject } from './interfaces/index.ts';

export class Transpiler {
    #tsconfig: TsconfigObject;

    constructor(tsconfig: TsconfigObject) {
        this.#tsconfig = tsconfig;
    }

    
}