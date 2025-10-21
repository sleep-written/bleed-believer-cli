import { fibonacci } from './fibonacci.js';
import test from 'ava';

test('get [ 0, 1 ]', t => {
    t.deepEqual(
        fibonacci(2),
        [ 0, 1 ]
    );
});

test('get [ 0, 1, 1, 2, 3, 5 ]', t => {
    t.deepEqual(
        fibonacci(6),
        [ 0, 1, 1, 2, 3, 5 ]
    );
});

test('get [ 0, 1, 1, 2, 3, 5, 8, 13, 21 ]', t => {
    t.deepEqual(
        fibonacci(9),
        [ 0, 1, 1, 2, 3, 5, 8, 13, 21 ]
    );
});