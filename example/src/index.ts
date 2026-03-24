import { styleText } from 'node:util';

const r = (await import('@lib/sum.js')).sum(2, 2);
const t = styleText('yellow', r.toString());
console.log('value:', t);