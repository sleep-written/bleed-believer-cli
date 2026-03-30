export interface SourceFileInject {
    readFile?(path: string, encoding: BufferEncoding): Promise<string>;
    dirname?(path: string): string;
    resolve?(...parts: string[]): string;
    access?(path: string): Promise<void>;
    sep?: string;
}