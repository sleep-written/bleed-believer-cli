import type { TargetFileConstructor } from './target-file.constructor.ts';

export interface PathAliasInject {
    fileURLToPath?(url: string): string;
    pathToFileURL?(path: string): URL;
    accessSync?(path: string): void;
    isAbsolute?(path: string): boolean;
    relative?(from: string, to: string): string;
    dirname?(path: string): string;
    resolve?(...p: string[]): string;

    targetFile?: TargetFileConstructor;
    sep?: string;
}