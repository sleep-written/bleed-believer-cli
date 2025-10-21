import { Snake } from './snake.js';
import test from 'ava';

test('Snake one cuadrant', t => {
    const snake = new Snake('💀')
        .up(5, '💀')
        .left(3, '💀')
        .down(4, '💀')
        .left(2, '💀');

    t.deepEqual(snake.segments, [
        { x:  0, y: 0, value: '💀' },
        { x:  0, y: 0, value: '💀' },
        { x:  0, y: 1, value: '💀' },
        { x:  0, y: 2, value: '💀' },
        { x:  0, y: 3, value: '💀' },
        { x:  0, y: 4, value: '💀' },
        { x:  0, y: 5, value: '💀' },
        { x:  0, y: 5, value: '💀' },
        { x: -1, y: 5, value: '💀' },
        { x: -2, y: 5, value: '💀' },
        { x: -3, y: 5, value: '💀' },
        { x: -3, y: 5, value: '💀' },
        { x: -3, y: 4, value: '💀' },
        { x: -3, y: 3, value: '💀' },
        { x: -3, y: 2, value: '💀' },
        { x: -3, y: 1, value: '💀' },
        { x: -3, y: 1, value: '💀' },
        { x: -4, y: 1, value: '💀' },
        { x: -5, y: 1, value: '💀' }
    ]);
});

test('Snake crosing cuadrants', t => {
    const snake = new Snake('💀')
        .up(2, '💀')
        .left(2, '💀')
        .down(4, '💀')
        .right(4, '💀');

    t.deepEqual(snake.segments, [
        { x:  0, y:  0, value: '💀' },
        { x:  0, y:  0, value: '💀' },
        { x:  0, y:  1, value: '💀' },
        { x:  0, y:  2, value: '💀' },
        { x:  0, y:  2, value: '💀' },
        { x: -1, y:  2, value: '💀' },
        { x: -2, y:  2, value: '💀' },
        { x: -2, y:  2, value: '💀' },
        { x: -2, y:  1, value: '💀' },
        { x: -2, y:  0, value: '💀' },
        { x: -2, y: -1, value: '💀' },
        { x: -2, y: -2, value: '💀' },
        { x: -2, y: -2, value: '💀' },
        { x: -1, y: -2, value: '💀' },
        { x:  0, y: -2, value: '💀' },
        { x:  1, y: -2, value: '💀' },
        { x:  2, y: -2, value: '💀' }
    ]);
});
