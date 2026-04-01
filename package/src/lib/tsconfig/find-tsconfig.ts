import type { ParsedPath } from 'node:path';

import { dirname, isAbsolute, parse, resolve } from 'node:path';
import { stat } from 'node:fs/promises';

export interface StatResult {
    isFile(): boolean;
}

export interface FindTsconfigInject {
    isAbsolute?(path: string): boolean;
    dirname?(path: string): string;
    resolve?(...p: string[]): string;
    parse?(path: string): ParsedPath
    stat?(path: string): Promise<StatResult>;
}

export async function findTsconfig(path: string, inject?: FindTsconfigInject): Promise<string> {
    const injected: Required<FindTsconfigInject> = {
        isAbsolute: inject?.isAbsolute?.bind(inject)    ?? isAbsolute,
        dirname:    inject?.dirname?.bind(inject)       ?? dirname,
        resolve:    inject?.resolve?.bind(inject)       ?? resolve,
        parse:      inject?.parse?.bind(inject)         ?? parse,
        stat:       inject?.stat?.bind(inject)          ?? stat,
    };

    const root = injected.resolve(
        injected.parse(path).root,
        'tsconfig.json'
    );

    while (path !== root) {
        if (!/\.json$/i.test(path)) {
            const stat: StatResult = await injected
                .stat(path)
                .catch(_ => ({ isFile: () => false}));

            path = injected.resolve(
                stat.isFile()
                ?   injected.dirname(path)
                :   path,
                'tsconfig.json'
            );
        }

        try {
            const stat = await injected.stat(path);
            if (stat.isFile()) {
                return path;
            }

            throw new Error('lol');
        } catch (err) {
            path = injected.dirname(path);
        }
    }

    throw new Error(`"tsconfig.json" not found`);
}