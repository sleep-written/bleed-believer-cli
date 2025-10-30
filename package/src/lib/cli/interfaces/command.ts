import type { CommandContext } from './command.context.js';

export interface Command<T> {
    execute(context: CommandContext): Promise<T>;
}