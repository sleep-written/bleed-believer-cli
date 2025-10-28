import { randomUUID } from 'crypto';
import { sayHello } from '@lib/say-hello.mjs';
import data from '../data.json' with { type: 'json' };

console.log('Create UUID:', randomUUID());
sayHello('pendejo');
console.log('data:', data);