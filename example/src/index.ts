import { styleText } from 'node:util';
import { encode } from '@toon-format/toon';

console.log(
    'toon:',
    styleText(
        'green',
        encode({ foo: 'bar' })
    )
);

console.log(
    'toon:',
    styleText(
        'green',
        await import('@toon-format/toon')
            .then(x => x.encode({ bak: 'baz' }))
    )
);

console.log(
    'value:',
    styleText(
        'yellow',
        await import('@lib/sum.ts')
            .then(x => x.sum(1, 1))
            .then(x => x.toString())
    )
);

console.log(
    'value:',
    styleText(
        'yellow',
        await import('@lib/sum.js')
            .then(x => x.sum(2, 2))
            .then(x => x.toString())
    )
);

console.log(
    'value:',
    styleText(
        'yellow',
        await import('./lib/sum.ts')
            .then(x => x.sum(3, 3))
            .then(x => x.toString())
    )
);

console.log(
    'value:',
    styleText(
        'yellow',
        await import('./lib/sum.js')
            .then(x => x.sum(4, 4))
            .then(x => x.toString())
    )
);