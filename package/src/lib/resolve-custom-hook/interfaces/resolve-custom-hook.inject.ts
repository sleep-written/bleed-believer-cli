export interface ResolveCustomHookInject {
    dirname?(path: string): string;
    resolve?(...parts: string[]): string;
    sep?: string;
}