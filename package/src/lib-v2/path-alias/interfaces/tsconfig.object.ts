export interface TsconfigObject {
    path: string;
    options: {
        paths?: Record<string, string[]>;
        outDir?: string;
        rootDir?: string;
        baseUrl?: string;
    };
}