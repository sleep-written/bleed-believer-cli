import type { Viewport, HexFunction } from './interfaces/index.js';

import { CartesianPlane } from '@lib/cartesian-plane/index.js';
import chalk from 'chalk';

export class Screen {
    #plane = new CartesianPlane<string>();
    #viewport: Viewport;
    #hexFunction: (hex: string) => (v: string) => string;

    constructor(viewport: Viewport, hexFunction?: HexFunction) {
        this.#viewport = viewport;
        this.#hexFunction = hexFunction ?? chalk.hex;
    }

    add(x: number, y: number, hex: string): Screen {
        this.#plane.set(x, y, hex);
        return this;
    }

    remove(x: number, y: number): Screen {
        this.#plane.set(x, y, undefined);
        return this;
    }

    clear(): Screen {
        this.#plane.clear();
        return this;
    }

    toString(): string {
        const pixels: string[][] = [];
        const x1 = -Math.round(this.#viewport.width  / 2);
        const x2 = +Math.round(this.#viewport.width  / 2);
        const y1 = +Math.round(this.#viewport.height / 2);
        const y2 = -Math.round(this.#viewport.height / 2);

        for (let y = y1; y >= y2; y--) {
            const row: string[] = [];
            for (let x = x1; x <= x2; x++) {
                const hex = this.#plane.get(x, y);
                if (typeof hex === 'string') {
                    row.push(this.#hexFunction(hex)('⬛'));
                } else if (x === 0 && y === 0) {
                    row.push(this.#hexFunction('#666666')('⬜'));
                } else if (x === 0 || y === 0) {
                    row.push(this.#hexFunction('#404040')('⬜'));
                } else {
                    row.push(this.#hexFunction('#202020')('⬜'));
                }
            }

            pixels.push(row);
        }

        return pixels
            .map(x => x.join(''))
            .join('\n');
    }
}