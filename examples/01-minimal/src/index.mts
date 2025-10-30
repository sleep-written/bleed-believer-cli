import { randomUUID } from 'crypto';
import { sayHello } from '@lib/say-hello.mjs';
import data from '../data.json' with { type: 'json' };

sayHello('perreo');
console.log('UUID:', randomUUID());
console.log('data:', data);
console.log('argv:', process.argv.slice(2));