export interface TsconfigObject {
    path: string;
    options: {
        outDir?: string;
        rootDir?: string;
        baseUrl?: string;
        paths?: Record<string, string[]>;
    };
}