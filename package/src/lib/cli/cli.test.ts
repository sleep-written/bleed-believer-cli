import type { ArgvRoute, Command, CommandContext } from './interfaces/index.js';

import { Cli } from './cli.js';
import { Argv } from './argv.js';
import test from 'ava';

interface CommandResult {
    context: CommandContext;
    message: string[];
}

const routes: ArgvRoute<CommandResult>[] = [
    {
        path: [ 'hola' ],
        target: class implements Command<CommandResult> {
            async execute(context: CommandContext): Promise<CommandResult> {
                return { context, message: [ 'hola' ] };
            }
        }
    },
    {
        path: [ 'hola', 'mundo' ],
        target: class implements Command<CommandResult> {
            async execute(context: CommandContext): Promise<CommandResult> {
                return { context, message: [ 'hola', 'mundo' ] };
            }
        }
    },
    {
        path: [ 'exec', ':target' ],
        target: class implements Command<CommandResult> {
            async execute(context: CommandContext): Promise<CommandResult> {
                return { context, message: [ 'exec', ':target' ] };
            }
        }
    },
    {
        path: [ 'exec', ':target', '...' ],
        target: class implements Command<CommandResult> {
            async execute(context: CommandContext): Promise<CommandResult> {
                return { context, message: [ 'exec', ':target', '...' ] };
            }
        }
    }
];

test('exec [ "hola" ]', async t => {
    const argv = new Argv(
        [ 'hola' ]
    );

    const router = new Cli(argv, routes);
    const result = await router.execute();

    t.deepEqual(result, {
        message: [ 'hola' ],
        context: {
            tail: [],
            flags: {},
            params: {}
        }
    } as CommandResult);
});

test.only('exec [ "hola", "mundo" ]', async t => {
    const argv = new Argv(
        [ 'hola', 'mundo' ],
        { '--foo': [ 'bar', 'baz' ] }
    );

    const router = new Cli(argv, routes);
    const result = await router.execute();

    t.deepEqual(result, {
        message: [ 'hola', 'mundo' ],
        context: {
            tail: [],
            flags: { '--foo': [ 'bar', 'baz' ] },
            params: {}
        }
    } as CommandResult);
});

test.only('exec [ "exec", "./hola/mundo.csv" ]', async t => {
    const argv = new Argv(
        [ 'exec', './hola/mundo.csv' ],
        {
            '--foo': [ 'bar', 'baz' ],
            '--lol': [ 'kek', 'iei' ]
        }
    );

    const router = new Cli(argv, routes);
    const result = await router.execute();

    t.deepEqual(result, {
        message: [ 'exec', ':target' ],
        context: {
            tail: [],
            flags: {
                '--foo': [ 'bar', 'baz' ],
                '--lol': [ 'kek', 'iei' ]
            },
            params: {
                target: [ './hola/mundo.csv' ]
            }
        }
    } as CommandResult);
});

test.only('exec [ "exec", "./hola/mundo.csv", "aaa", "bbb", "ccc" ]', async t => {
    const argv = new Argv(
        [ 'exec', './hola/mundo.csv', 'aaa', 'bbb', 'ccc' ],
        {
            '--foo': [ 'bar', 'baz' ],
            '--lol': [ 'kek', 'iei' ]
        }
    );

    const router = new Cli(argv, routes);
    const result = await router.execute();

    t.deepEqual(result, {
        message: [ 'exec', ':target', '...' ],
        context: {
            tail:   [ 'aaa', 'bbb', 'ccc' ],
            flags:  {
                '--foo': [ 'bar', 'baz' ],
                '--lol': [ 'kek', 'iei' ]
            },
            params: {
                target: [ './hola/mundo.csv' ]
            }
        }
    } as CommandResult);
});