export interface ArgvParseResult {
    main: string[];
    flags: Record<string, string[]>;
}