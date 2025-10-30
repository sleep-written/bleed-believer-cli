#! /usr/bin/env node
import { logger } from '@/logger.js';
import { cli } from '@cli/index.js';


try {
    logger.info('Begin execution...');
    await cli.execute();
    logger.info('Execution complete');
} catch (err: any) {
    logger.error(err?.message);
}