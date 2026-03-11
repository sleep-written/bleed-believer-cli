export interface TsconfigLoadInject {
    readFile?(
        path: string,
        encoding: BufferEncoding
    ): Promise<string>;

    isAbsolute?(
        path: string
    ): boolean;

    resolve?(
        path: string,
        ...n: string[]
    ): string;

    process?: {
        cwd(): string;
    };
}