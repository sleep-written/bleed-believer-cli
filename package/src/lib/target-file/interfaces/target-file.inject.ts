export interface TargetFileInject {
    sep?: string;
    dirname?(path: string): string;
    resolve?(...p: string[]): string;
    basename?(path: string): string;
    accessSync?(path: string): void;
    isAbsolute?(path: string): boolean;
    fileURLToPath?(url: string): string;
    pathToFileURL?(path: string): URL;
}