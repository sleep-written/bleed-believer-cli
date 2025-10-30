import type { Command } from './command.js';

export interface ArgvRoute<T> {
    path: string[];
    name?: string;
    info?: string;
    target: new() => Command<T>;
}