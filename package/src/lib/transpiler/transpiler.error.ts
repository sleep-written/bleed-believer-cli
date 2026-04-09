import { styleText } from 'node:util';

interface Diagnostic {
    messageText: string | {
        messageText: string;
    };

    length?: number;
    start?: number;
    file?: {
        text: string;
    }
}

export class TranspilerError extends Error {
    static #printSeparator(length: number): string {
        return styleText(
            'gray', ''.padStart(length, '-')
        );
    }

    static #printSourceCode(diagnostic: Diagnostic): string {
        if (
            !diagnostic.file ||
            typeof diagnostic.start !== 'number' ||
            typeof diagnostic.length !== 'number'
        ) {
            return '';
        }

        const left = diagnostic.file.text.slice(0, diagnostic.start);
        const right = diagnostic.file.text.slice(diagnostic.start + diagnostic.length);
        const source = diagnostic.length === 0
        ?   [
                left,
                styleText([ 'redBright' ], '<<< '),
                styleText([ 'redBright', 'underline' ], 'HERE!'),
                right
            ].join('')
        :   [
                left,
                styleText(
                    [ 'redBright', 'underline' ],
                    diagnostic.file.text.slice(
                        diagnostic.start,
                        diagnostic.start + diagnostic.length
                    )
                ),
                right
            ].join('');
        
        const lines = source.split('\n');
        const lineCountLength = lines.length.toString().length;
        return source
            .split('\n')
            .map((text, index) => ({
                value: text,
                index: (index + 1)
                    .toString()
                    .padStart(lineCountLength, ' ')
            }))
            .map(({ index, value }) => [
                styleText('gray', index),
                styleText('gray', ' - '),
                value
            ])
            .map(x => x.join(''))
            .join('\n');
    }

    constructor(diagnostic: Diagnostic) {
        super(
            typeof diagnostic.messageText !== 'string'
            ?   diagnostic.messageText.messageText
            :   diagnostic.messageText
        );

        if (diagnostic.file) {
            this.message += [
                '',
                TranspilerError.#printSeparator(this.message.length + 7),
                TranspilerError.#printSourceCode(diagnostic),
                '',
            ].join('\n');
        }
    }
}