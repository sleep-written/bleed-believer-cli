import type { ParseArgsOptionsType } from 'node:util';

import { styleText } from 'node:util';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { CLI } from '../lib/cli/index.ts';

interface Dcto {
    info: string;
    path: string;
    flags: {
        name: string;
        info: string;
        type: ParseArgsOptionsType;
        alias: string | undefined;
        default: string | boolean | string[] | boolean[] | undefined;
    }[];
}

function print(dcto: Dcto): void {
    console.log(styleText('gray', '---'));
    console.log('');
    console.log(
        styleText(
            [ 'bold' ],
            'Command [' + styleText('blueBright', dcto.path) + ']:'
        )
    );

    console.log(dcto.info);
    console.log('');

    if (dcto.flags.length > 0) {
        console.log('Flags:');
        for (const flag of dcto.flags) {
            const flagPath = [ `--${flag.name}` ];
            if (typeof flag.alias === 'string') {
                flagPath.push(`-${flag.alias}`);
            }

            let type = `type ${styleText('yellow', flag.type)}`;
            if (flag.default != null) {
                type += `, default ${styleText('greenBright', JSON.stringify(flag.default))}`;
            }

            console.log(
                flagPath
                    .map(x => styleText('gray', x))
                    .join(', '),
                `(${type}):`
            );

            console.log(flag.info);
            console.log('');
        }
    }
}

export const helpCommand = CLI.createCommand(
    {
        positionals: [ 'help' ] as const
    },
    async (o, c) => {
        const defaultInfo = 'None information provided';
        const dctos = c
            .filter(x => x !== helpCommand)
            .map(x => ({
                info: x.settings.info ?? defaultInfo,
                path: x.settings.positionals.join(' '),
                flags: Object
                    .entries(x.settings.options ?? {})
                    .map(([ k, v ]) => ({
                        name: k,
                        info: v.info ?? defaultInfo,
                        type: v.type,
                        alias: v.short,
                        default: v.default
                    }))
            } as Dcto));

        const banner = await readFile(
            resolve(import.meta.dirname, '../../banner.txt'),
            'utf-8'
        );

        console.log(styleText('greenBright', banner));
        console.log('');
        console.log(
            ''.padStart(21, ' '),
            styleText(
                [ 'bold', 'yellow' ],
                '@bleed-believer/cli'
            )
        );
        console.log('');

        for (const dcto of dctos) {
            print(dcto);
        }
    }
)