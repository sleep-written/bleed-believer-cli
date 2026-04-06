export interface PathAliasInject {
    fileURLToPath?(url: string): string;
    pathToFileURL?(path: string): URL;
    accessSync?(path: string): void;
    relative?(from: string, to: string): string;
    dirname?(path: string): string;
    resolve?(...p: string[]): string;
    sep?: string;
}