import type { Diagnostic } from 'typescript';

export interface TsconfigLoadInject {
    readConfigFile?(
        path: string,
        readFile: (p: string) => string
    ): {
        config?: any;
        error?: Diagnostic
    };

    normalize?(
        path: string
    ): string;

    basename?(
        path: string
    ): string;

    resolve?(
        ...parts: string[]
    ): string;

    dirname?(
        path: string
    ): string;
}