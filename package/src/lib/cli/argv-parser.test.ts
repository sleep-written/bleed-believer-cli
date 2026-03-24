import { argvParser } from './argv-parser.ts';
import { ArgvParserError } from './argv-parser.error.ts';
import test from 'node:test';

test('Parse simple settings', (t: test.TestContext) => {
    const out = argvParser(
        {
            positionals: [ 'hello', 'world' ]
        },
        {
            argv: [
                ...process.argv.slice(0, 2),
                'hello', 'world'
            ]
        }
    );

    t.assert.deepStrictEqual(out, {
        positionals: {},
        flags: {},
        args: []
    });
});

test('Parse simple settings and fail', (t: test.TestContext) => {
    t.assert.throws(
        () => {
            argvParser(
                {
                    positionals: [ 'hello', 'world' ]
                },
                {
                    argv: [
                        ...process.argv.slice(0, 2),
                        'hello', 'caca'
                    ]
                }
            );
        },
        ArgvParserError
    );
});

test('Parse complex settings', (t: test.TestContext) => {
    const out = argvParser(
        {
            positionals: [ 'kill', ':path' ],
            options: {
                force: {
                    type: 'boolean',
                    default: false
                }
            }
        },
        {
            argv: [
                ...process.argv.slice(0, 2),
                'kill', './output.wav', '--force'
            ]
        }
    );

    t.assert.deepStrictEqual(out, {
        positionals: { path: './output.wav' },
        flags: { force: true },
        args: []
    });
});

test('Parse complex settings with array', (t: test.TestContext) => {
    const out = argvParser(
        {
            positionals: [
                'merge',
                ':output',
                '...:inputs'
            ],
            options: {
                force: {
                    type: 'boolean',
                    default: false
                }
            }
        },
        {
            argv: [
                ...process.argv.slice(0, 2),
                'merge',
                './output.wav',
                './input-01.wav',
                './input-02.wav',
                './input-03.wav'
            ]
        }
    );

    t.assert.deepStrictEqual(out, {
        positionals: {
            output: './output.wav',
            inputs: [
                './input-01.wav',
                './input-02.wav',
                './input-03.wav'
            ]
        },
        flags: {},
        args: []
    });
});

test('Parse complex settings with array and fail', (t: test.TestContext) => {
    t.assert.throws(
        () => {
            argvParser(
                {
                    positionals: [
                        'merge',
                        ':output',
                        '...:inputs'
                    ],
                    options: {
                        force: {
                            type: 'boolean',
                            default: false
                        }
                    }
                },
                {
                    argv: [
                        ...process.argv.slice(0, 2),
                        'merge'
                    ]
                }
            );

        },
        ArgvParserError
    )
});

test('Parse complex settings with unparseable args', (t: test.TestContext) => {
    const out = argvParser(
        {
            positionals: [ 'start', ':target' ],
            options: {
                watch: {
                    type: 'boolean',
                    default: false
                }
            }
        },
        {
            argv: [
                ...process.argv.slice(0, 2),
                'start', '--watch', './src/index.ts',
                '--', 'hello', 'world', '--lol'
            ]
        }
    );

    t.assert.deepStrictEqual(out, {
        positionals: {
            target: './src/index.ts'
        },
        flags: {
            watch: true
        },
        args: [ 'hello', 'world', '--lol' ]
    });
});

test('Parse optional args', (t: test.TestContext) => {
    const out1 = argvParser(
        {
            positionals: [ 'help', ':target?' ]
        },
        {
            argv: [
                ...process.argv.slice(0, 2),
                'help', 'start'
            ]
        }
    );

    t.assert.deepStrictEqual(out1, {
        positionals: {
            target: 'start'
        },
        flags: { },
        args: [ ]
    });

    const out2 = argvParser(
        {
            positionals: [ 'help', ':target?' ]
        },
        {
            argv: [
                ...process.argv.slice(0, 2),
                'help'
            ]
        }
    );

    t.assert.deepStrictEqual(out2, {
        positionals: {
            target: undefined
        },
        flags: { },
        args: [ ]
    });
});