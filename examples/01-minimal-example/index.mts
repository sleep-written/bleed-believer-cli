import { randomUUID } from 'crypto';
import { sayHello } from './lib/say-hello.mjs';

sayHello('perreo');
console.log('UUID:', randomUUID());
console.log('argv:', process.argv.slice(2));