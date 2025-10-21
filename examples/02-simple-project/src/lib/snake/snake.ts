import type { Segment } from './segment.js';

import { Angle } from '@lib/angle/index.js';

export class Snake<T> {
    #segments: Segment<T>[] = [];
    get segments():Segment<T>[] {
        return this.#segments.map(x => structuredClone(x));
    }
    
    constructor(value: T) {
        this.#segments.push({
            x: 0,
            y: 0,
            value
        });
    }

    up(steps: number, value: T): Snake<T> {
        steps = Math.abs(Math.trunc(steps));
        let { x, y } = this.#segments.at(-1)!;
        for (let i = 0; i <= steps; i++) {
            this.#segments.push({ x, y, value });

            if (i < steps) {
                y++;
            }
        }

        return this;
    }

    down(steps: number, value: T): Snake<T> {
        steps = Math.abs(Math.trunc(steps));
        let { x, y } = this.#segments.at(-1)!;
        for (let i = 0; i <= steps; i++) {
            this.#segments.push({ x, y, value });

            if (i < steps) {
                y--;
            }
        }

        return this;
    }

    left(steps: number, value: T): Snake<T> {
        steps = Math.abs(Math.trunc(steps));
        let { x, y } = this.#segments.at(-1)!;
        for (let i = 0; i <= steps; i++) {
            this.#segments.push({ x, y, value });

            if (i < steps) {
                x--;
            }
        }

        return this;
    }

    right(steps: number, value: T): Snake<T> {
        steps = Math.abs(Math.trunc(steps));
        let { x, y } = this.#segments.at(-1)!;
        for (let i = 0; i <= steps; i++) {
            this.#segments.push({ x, y, value });

            if (i < steps) {
                x++;
            }
        }

        return this;
    }
}