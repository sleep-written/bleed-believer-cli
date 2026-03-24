import type { ArgvSettings, ArgvOutput } from './interfaces/index.ts';
import { ArgvParserError } from './argv-parser.error.ts';
import { parseArgs } from 'node:util';

export function argvParser<
    S extends ArgvSettings,
    O extends ArgvOutput<S>
>(
    settings: S,
    processInject?: { argv: string[]; }
): O {
    const args = processInject
        ?   processInject.argv
        :   process.argv;

    const rawArgs = args.slice(2);
    const sepIndex = rawArgs.indexOf('--');
    const extraArgs = sepIndex >= 0 ? rawArgs.slice(sepIndex + 1) : [];
    const parsableArgs = sepIndex >= 0 ? rawArgs.slice(0, sepIndex) : rawArgs;

    // Strip defaults so parseArgs only returns explicitly-provided flags
    const strippedOptions = settings.options
        ? Object.fromEntries(
            Object.entries(settings.options).map(([key, val]) => {
                const { default: _, ...rest } = val as unknown as Record<string, unknown>;
                return [key, rest];
            })
        )
        : undefined;

    const { positionals: parsedPositionals, values } = parseArgs({
        args: parsableArgs,
        strict: settings.strict,
        options: strippedOptions as typeof settings.options,
        allowNegative: settings.allowNegative,
        allowPositionals: settings.positionals.length > 0,
    });

    const positionalResult: Record<string, string | string[]> = {};
    for (let i = 0; i < settings.positionals.length; i++) {
        const pattern = settings.positionals[i];

        if (pattern.startsWith('...:')) {
            positionalResult[pattern.slice(4)] = parsedPositionals.slice(i);
            break;

        } else if (pattern.startsWith(':')) {
            const isOptional = pattern.endsWith('?');
            const key = isOptional ? pattern.slice(1, -1) : pattern.slice(1);
            if (parsedPositionals[i] === undefined) {
                if (!isOptional) {
                    throw new ArgvParserError(settings.positionals, parsedPositionals);
                }
                positionalResult[key] = undefined as unknown as string;
            } else {
                positionalResult[key] = parsedPositionals[i];
            }

        } else if (parsedPositionals[i] !== pattern) {
            throw new ArgvParserError(settings.positionals, parsedPositionals);

        }
    }

    return {
        positionals: positionalResult,
        flags: { ...values },
        args: extraArgs
    } as unknown as O;
}