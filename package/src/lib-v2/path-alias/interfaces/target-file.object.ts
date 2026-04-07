export interface TargetFileObject {
    basename: string;
    dirname: string;
    exists: boolean;
    isTs: boolean;
    isJs: boolean;
    href: string;

    toString(): string;
    toTs(): TargetFileObject;
    toJs(): TargetFileObject;
}