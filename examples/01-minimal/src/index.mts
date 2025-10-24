import { randomUUID } from 'crypto';
import { sayHello } from '@lib/say-hello.mjs';

console.log('Create UUID:', randomUUID());
sayHello('pendejo');