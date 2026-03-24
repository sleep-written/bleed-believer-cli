import type { ArgvOutput } from './argv-output.ts';
import type { ArgvSettings } from './argv-settings.ts';

export interface Command<S extends ArgvSettings> {
    settings: S;
    callback: (
        output: ArgvOutput<S>,
        context: Command<ArgvSettings>[]
    ) => unknown;
}