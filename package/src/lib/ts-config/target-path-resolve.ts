import type { LoadTSConfigInject } from './interfaces/index.js';
import { isAbsolute, resolve } from 'path';

export function targetPathResolve(
    target?: string | null,
    inject?: LoadTSConfigInject
): string {
    const processObj = inject?.process ?? process;
    if (typeof target !== 'string') {
        target = '.';
    }

    if (!isAbsolute(target)) {
        target = resolve(processObj.cwd(), target);
    }

    if (!/\.json$/i.test(target)) {
        target = resolve(target, 'tsconfig.json');
    }

    return target;
}