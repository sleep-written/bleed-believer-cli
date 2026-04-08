export interface PathAliasInject {
    sep?: string;
    dirname?(path: string): string;
    resolve?(...p: string[]): string;
    relative?(from: string, to: string): string;
    accessSync?(path: string): void;
    fileURLToPath?(path: string): string;
}