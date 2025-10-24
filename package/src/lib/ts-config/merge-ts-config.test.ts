import type { TSConfig } from './interfaces/index.js';

import { mergeTSConfig } from './merge-ts-config.js';
import test from 'ava';

test('Merge 2 simple JSON files', t => {
    const json1: TSConfig = {
        compilerOptions: {
            target: 'es2024'
        }
    };

    const json2: TSConfig = {
        compilerOptions: {
            module: 'node20'
        }
    };

    const result = mergeTSConfig(json1, json2);
    t.deepEqual(result, {
        compilerOptions: {
            target: 'es2024',
            module: 'node20'
        }
    });
});

test('Merge 2 simple JSON files with override', t => {
    const json1: TSConfig = {
        compilerOptions: {
            target: 'es2020',
            module: 'node20'
        }
    };

    const json2: TSConfig = {
        compilerOptions: {
            target: 'es2022'
        }
    };

    const json3: TSConfig = {
        compilerOptions: {
            target: 'es2024'
        }
    };

    const result = mergeTSConfig(json1, json2, json3);
    t.deepEqual(result, {
        compilerOptions: {
            target: 'es2024',
            module: 'node20'
        }
    });
});

test('Check inmutable', t => {
    const json1: TSConfig = {
        compilerOptions: {
            target: 'es2024',
            module: 'node20',
            baseUrl: '.',
            paths: {
                '@foo/*': [ 'foo/*' ]
            }
        }
    };

    const json2: TSConfig = {
        compilerOptions: {
            paths: {
                '@bar/*': [ 'bar/*' ]
            }
        }
    };

    const json3: TSConfig = {
        compilerOptions: {
            paths: {
                '@baz/*': [ 'baz/*' ]
            }
        }
    };

    const json4 = mergeTSConfig(json1, json2, json3);
    t.deepEqual(json4, {
        compilerOptions: {
            target: 'es2024',
            module: 'node20',
            baseUrl: '.',
            paths: {
                '@foo/*': [ 'foo/*' ],
                '@bar/*': [ 'bar/*' ],
                '@baz/*': [ 'baz/*' ]
            }
        }
    });

    const paths = json4.compilerOptions!.paths!;
    paths['@baz/*'][0] = 'kek/*';

    t.deepEqual(json4, {
        compilerOptions: {
            target: 'es2024',
            module: 'node20',
            baseUrl: '.',
            paths: {
                '@foo/*': [ 'foo/*' ],
                '@bar/*': [ 'bar/*' ],
                '@baz/*': [ 'kek/*' ]
            }
        }
    });

    t.deepEqual(json3, {
        compilerOptions: {
            paths: {
                '@baz/*': [ 'baz/*' ]
            }
        }
    });
});