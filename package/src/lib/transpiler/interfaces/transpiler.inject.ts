export interface TranspilerInject {
    logger?: {
        info(...args: any[]): void;
    };
}