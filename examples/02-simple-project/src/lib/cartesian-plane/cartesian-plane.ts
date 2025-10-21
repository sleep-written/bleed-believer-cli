export class CartesianPlane<T> {
    #matrix = new Map<number, Map<number, T>>();

    get xMin(): number {
        const values = new Set<number>();
        Array
            .from(this.#matrix.values())
            .map(x => Array.from(x.keys()))
            .flat()
            .forEach(x => values.add(x));

        return Array
            .from(values)
            .sort((a, b) => a - b)
            .at(0) ?? 0;
    }

    get xMax(): number {
        const values = new Set<number>();
        Array
            .from(this.#matrix.values())
            .map(x => Array.from(x.keys()))
            .flat()
            .forEach(x => values.add(x));

        return Array
            .from(values)
            .sort((a, b) => a - b)
            .at(-1) ?? 0;
    }

    get yMin(): number {
        return Array
            .from(this.#matrix.keys())
            .sort((a, b) => a - b)
            .at(0) ?? 0;
    }

    get yMax(): number {
        return Array
            .from(this.#matrix.keys())
            .sort((a, b) => a - b)
            .at(-1) ?? 0;
    }

    get(x: number, y: number): T | undefined {
        x = Math.trunc(x);
        y = Math.trunc(y);
        return this.#matrix.get(y)?.get(x);
    }

    set(x: number, y: number, value: T | undefined): CartesianPlane<T> {
        x = Math.trunc(x);
        y = Math.trunc(y);

        if (typeof value === 'undefined') {
            const xAxis = this.#matrix.get(y);
            if (xAxis) {
                xAxis.delete(x);
                if (xAxis.size === 0) {
                    this.#matrix.delete(y);
                }
            }

        } else {
            if (!this.#matrix.has(y)) {
                this.#matrix.set(y, new Map());
            }

            this.#matrix.get(y)!.set(x, value);
        }

        return this;
    }

    forEach(callback: (x: number, y: number, value: T) => void): void {
        Array
            .from(this.#matrix.entries())
            .sort(([ ya ], [ yb ]) => ya - yb)
            .map(([ y, xAxis ]) => Array
                .from(xAxis.entries())
                .sort(([ xa ], [ xb ]) => xa - xb)
                .map(([ x, value ]) => ({ x, y, value }))
            )
            .flat()
            .forEach(({ x, y, value }) => callback(x, y, value));
    }

    map<V>(callback: (x: number, y: number, value: T) => V): V[] {
        return Array
            .from(this.#matrix.entries())
            .sort(([ ya ], [ yb ]) => ya - yb)
            .map(([ y, xAxis ]) => Array
                .from(xAxis.entries())
                .sort(([ xa ], [ xb ]) => xa - xb)
                .map(([ x, value ]) => ({ x, y, value }))
            )
            .flat()
            .map(({ x, y, value }) => callback(x, y, value));
    }

    clear(): CartesianPlane<T> {
        this.#matrix = new Map();
        return this;
    }
}