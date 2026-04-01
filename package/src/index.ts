import { register } from 'node:module';
import { extname } from 'node:path';

const ext = extname(import.meta.url);
const url = new URL(`./hooks${ext}`, import.meta.url);
register(url);