export interface TsconfigObject {
    resolve(specifier: string): string[] | null;
}