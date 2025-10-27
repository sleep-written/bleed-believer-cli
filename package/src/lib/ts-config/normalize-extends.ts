export function normalizeExtends(value: string[] | string | undefined): string[] {
    if (value instanceof Array) {
        return value;
    } else if (typeof value === 'string') {
        return [ value ];
    } else {
        return [];
    }
}