export interface SWCInject {
    readFile?(path: string, encoding: BufferEncoding): Promise<string>;
    dirname?(path: string): string;
    resolve?(...p: string[]): string;
    sep?: string;
}