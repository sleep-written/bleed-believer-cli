export interface TsconfigInject {
    resolve?(
        ...parts: string[]
    ): string;

    dirname?(
        path: string
    ): string;

    isAbsolute?(
        path: string
    ): boolean;
}