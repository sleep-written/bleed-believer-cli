import { CartesianPlane } from './cartesian-plane.js';
import test from 'ava';

test('Test coordinate limits', t => {
    const plane = new CartesianPlane<true>()
        .set(-8, -5, true)
        .set( 9,  2, true)
        .set( 1,  1, true);

    t.is(plane.xMin, -8);
    t.is(plane.xMax,  9);

    t.is(plane.yMin, -5);
    t.is(plane.yMax,  2);
});

test('Test forEach', t => {
    const dots: {
        x: number;
        y: number;
        value: string;
    }[] = [];

    new CartesianPlane<string>()
        .set(+1, +1, 'car')
        .set(-1,  0, 'fox')
        .set( 0, -1, 'bak')
        .set(+1,  0, 'fol')
        .set(+1, -1, 'baz')
        .set( 0,  0, 'for')
        .set(-1, -1, 'bar')
        .set(-1, +1, 'cal')
        .set( 0, +1, 'cad')
        .map((x, y, value) => dots.push({ x, y, value }));

    t.deepEqual(dots, [
        { x: -1, y: -1, value: 'bar' },
        { x:  0, y: -1, value: 'bak' },
        { x: +1, y: -1, value: 'baz' },
        { x: -1, y:  0, value: 'fox' },
        { x:  0, y:  0, value: 'for' },
        { x: +1, y:  0, value: 'fol' },
        { x: -1, y: +1, value: 'cal' },
        { x:  0, y: +1, value: 'cad' },
        { x: +1, y: +1, value: 'car' },
    ]);
});

test('Test map', t => {
    const dots = new CartesianPlane<string>()
        .set(+1, +1, 'car')
        .set(-1,  0, 'fox')
        .set( 0, -1, 'bak')
        .set(+1,  0, 'fol')
        .set(+1, -1, 'baz')
        .set( 0,  0, 'for')
        .set(-1, -1, 'bar')
        .set(-1, +1, 'cal')
        .set( 0, +1, 'cad')
        .map((x, y, value) => ({ x, y, value }));

    t.deepEqual(dots, [
        { x: -1, y: -1, value: 'bar' },
        { x:  0, y: -1, value: 'bak' },
        { x: +1, y: -1, value: 'baz' },
        { x: -1, y:  0, value: 'fox' },
        { x:  0, y:  0, value: 'for' },
        { x: +1, y:  0, value: 'fol' },
        { x: -1, y: +1, value: 'cal' },
        { x:  0, y: +1, value: 'cad' },
        { x: +1, y: +1, value: 'car' },
    ]);
});