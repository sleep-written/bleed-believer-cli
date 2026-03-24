export class ArgvParserError extends Error {
    #expected: string[];
    get expected(): string[] {
        return this.#expected;
    }

    #received: string[];
    get received(): string[] {
        return this.#received;
    }

    constructor(
        expected: string[],
        received: string[]
    ) {
        super(
            `Invalid positional arguments.\n` +
            `- Expected: "${expected.join(' ')}"\n` +
            `- Received: "${received.join(' ')}"`
        );
        this.#expected = expected;
        this.#received = received;
    }
}