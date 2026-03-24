import type { ArgvSettings } from './argv-settings.ts';
import type { parseArgs } from 'node:util';

export interface ArgvOutput<S extends ArgvSettings> {
    positionals:
        S['positionals'] extends Array<infer U>
        ?   {
            [
                K in Extract<U, string> as
                    K extends `...:${infer Key}` | `:${infer Key}?` | `:${infer Key}`
                ?   Key
                :   never
            ]:
                    K extends `...:${string}`
                ?   string[]
                :   K extends `:${string}?`
                ?   string | undefined
                :   K extends `:${string}`
                ?   string
                :   never;
        }
        :   {};

    flags: ReturnType<typeof parseArgs<S>>['values'];
    args: string[];
}