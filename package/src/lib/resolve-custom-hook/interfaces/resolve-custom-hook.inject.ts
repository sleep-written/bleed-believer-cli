export interface ResolveCustomHookInject {
    access?(
        path: string
    ): Promise<void>;
}