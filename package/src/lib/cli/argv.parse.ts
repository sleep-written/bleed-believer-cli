import type { ArgvParseResult, ArgvParseInject } from './interfaces/index.js';

const regexFlag = /^-{1,2}(?<key>[a-z0-9]+)(=(?<value>.+))?$/i;
export function argvParse(inject?: ArgvParseInject): ArgvParseResult {
    const main: string[] = [];
    const flags: Record<string, string[]> = {};
    const fragments = (inject?.process ?? process)?.argv?.slice(2);

    let flag: string | undefined;
    for (const fragment of fragments) {
        if (/^-{1,2}$/.test(fragment)) {
            // Flag to capture every other fragments after
            flag = '--';

        } else if (flag !== '--' && regexFlag.test(fragment)) {
            // Flag detected
            let { key, value } = regexFlag.exec(fragment)?.groups ?? {};
            key = `--${key.toLowerCase()}`;

            if (typeof value === 'string') {
                // Flag with value tuple
                const values = flags[key] ?? [];
                values.push(value);
                flags[key] = values;
            } else {
                // Only flag
                flag = key;
                if (!flags[key]) {
                    flags[key] = [];
                }
            }

        } else if (typeof flag === 'string') {
            // Flag value
            const values = flags[flag] ?? [];
            values.push(fragment);
            flags[flag] = values;

            if (flag !== '--') {
                flag = undefined;
            }

        } else {
            // Main value
            main.push(fragment);
        }
    }

    return { main, flags };
}