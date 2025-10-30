#! /usr/bin/env node
import { Logger } from 'tslog';
import { cli } from '@cli/index.js';

const logger = new Logger({
    name: '@bleed-believer',
    prettyLogTemplate:   `{{name}} - {{logLevelName}}\t→ `,
    prettyErrorTemplate: `{{errorMessage}}\n{{errorStack}}`
});

try {
    logger.info('Initializing...');
    await cli.execute();
    logger.info('Execution complete');
} catch (err: any) {
    logger.error(err?.message);
}