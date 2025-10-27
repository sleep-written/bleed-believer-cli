export interface SpecifierMatcherInject {
    process?: {
        cwd(): string;
    }

    access?: (path: string) => Promise<void>;
}