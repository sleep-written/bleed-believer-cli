import type { ArgvParseInject, ArgvParseResult } from './interfaces/index.js';

import { argvParse } from './argv.parse.js';
import test from 'ava';

test('Empty', t => {
    const inject: ArgvParseInject = {
        process: {
            argv: [
                process.argv[0],
                process.argv[1],
            ]
        }
    };

    const argv = argvParse(inject);
    t.deepEqual(argv, {
        main:  [],
        flags: {}
    } as ArgvParseResult);
});

test('Simple main arguments', t => {
    const inject: ArgvParseInject = {
        process: {
            argv: [
                process.argv[0],
                process.argv[1],
                'foo',
                'bar',
                'baz',
            ]
        }
    };

    const argv = argvParse(inject);
    t.deepEqual(argv, {
        main:  [ 'foo', 'bar', 'baz' ],
        flags: {}
    } as ArgvParseResult);
});

test('Simple main arguments with 2 flags', t => {
    const inject: ArgvParseInject = {
        process: {
            argv: [
                process.argv[0],
                process.argv[1],
                'foo',
                'bar',
                'baz',
                '--foo',
                'bar',
                '--bak',
                'baz',
            ]
        }
    };

    const argv = argvParse(inject);
    t.deepEqual(argv, {
        main:  [ 'foo', 'bar', 'baz' ],
        flags: {
            '--foo': [ 'bar' ],
            '--bak': [ 'baz' ]
        }
    } as ArgvParseResult);
});

test('Simple main arguments with 2 flags and more main arguments', t => {
    const inject: ArgvParseInject = {
        process: {
            argv: [
                process.argv[0],
                process.argv[1],
                'foo',
                'bar',
                'baz',
                '--foo',
                'bar',
                '--bak',
                'baz',
                'lol',
                'kek',
                'iei',
            ]
        }
    };

    const argv = argvParse(inject);
    t.deepEqual(argv, {
        main:  [ 'foo', 'bar', 'baz', 'lol', 'kek', 'iei' ],
        flags: {
            '--foo': [ 'bar' ],
            '--bak': [ 'baz' ]
        }
    } as ArgvParseResult);
});

test('Simple main arguments with 2 flags and more main arguments and "--" values', t => {
    const inject: ArgvParseInject = {
        process: {
            argv: [
                process.argv[0],
                process.argv[1],
                'foo',
                'bar',
                'baz',
                '--foo',
                'bar',
                '--bak',
                'baz',
                'lol',
                'kek',
                'iei',
                '--',
                'hola',
                'pinche',
                'bastardo',
                '--asobi',
                'asobase',
            ]
        }
    };

    const argv = argvParse(inject);
    t.deepEqual(argv, {
        main:  [ 'foo', 'bar', 'baz', 'lol', 'kek', 'iei' ],
        flags: {
            '--foo': [ 'bar' ],
            '--bak': [ 'baz' ],
            '--': [
                'hola',
                'pinche',
                'bastardo',
                '--asobi',
                'asobase',
            ]
        }
    } as ArgvParseResult);
});