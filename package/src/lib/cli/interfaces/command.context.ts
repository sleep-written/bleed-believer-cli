export interface CommandContext {
    params: Record<string, string[]>;
    flags: Record<string, string[]>;
    tail: string[];
}