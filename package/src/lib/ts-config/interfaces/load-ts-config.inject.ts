export interface LoadTSConfigInject {
    process?: {
        cwd(): string;
    };

    readFile?: (
        path: string,
        encoding: 'utf-8'
    ) => Promise<string>;
}