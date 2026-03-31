export class CommandNotFoundError extends Error {
    constructor() {
        super(`None command matched with the provided arguments.`);
    }
}