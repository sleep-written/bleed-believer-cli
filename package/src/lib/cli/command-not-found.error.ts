export class CommandNotFoundError extends Error {
    constructor(command?: string[]) {
        super(
            command instanceof Array
            ?   `Command "${command.join(' ')}" not found`
            :   `Command not found`
        );
    }
}