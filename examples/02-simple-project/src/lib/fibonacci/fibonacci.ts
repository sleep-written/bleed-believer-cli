let cache = [ 0, 1, 1 ];

export function fibonacci(length: number): number[] {
    const _cache = cache.slice();
    for (let i = _cache.length - 1; i < length; i++) {
        if (typeof _cache[i] !== 'number') {
            const a = _cache.at(-1) ?? 0;
            const b = _cache.at(-2) ?? 0;
            const r = a + b;
            _cache.push(r);

        }
    }

    cache = _cache;
    return cache.slice(0, length);
}