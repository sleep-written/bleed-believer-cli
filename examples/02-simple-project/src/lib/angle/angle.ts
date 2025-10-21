export class Angle {
    #value = 0;
    get value(): number {
        return this.#value;
    }

    constructor(value: number) {
        this.#value = value;
        this.#normalize();
    }

    #normalize(): void {
        while (this.#value >= 360) {
            this.#value -= 360;
        }

        while (this.#value < 0) {
            this.#value += 360;
        }
    }

    rotate(v: number): Angle {
        this.#value += v;
        this.#normalize();
        return this;
    }
}