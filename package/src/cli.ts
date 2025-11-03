#! /usr/bin/env node
import { CommandNotFoundError } from '@lib/cli/index.js';
import { logger } from '@/logger.js';
import { cli } from '@cli/index.js';
import chalk from 'chalk';

try {
    await cli.execute();
} catch (err: any) {
    if (err instanceof CommandNotFoundError) {
        for (const { name, info } of cli.docs()) {
            console.log(chalk.greenBright.bold(name));
            console.log(info ?? 'Description not available');
            console.log();
        }
    } else {
        logger.error(err?.message);
    }
}