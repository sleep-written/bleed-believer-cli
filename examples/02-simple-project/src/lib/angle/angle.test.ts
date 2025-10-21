import { Angle } from './angle.js';
import test from 'ava';

test('Test 90 deg clockwise rotation', t => {
    const angle = new Angle(0);
    t.is(angle.value, 0);
    t.is(angle.rotate(-90).value, 270);
    t.is(angle.rotate(-90).value, 180);
    t.is(angle.rotate(-90).value, 90);
    t.is(angle.rotate(-90).value, 0);
});

test('Test 90 deg reverse clockwise rotation', t => {
    const angle = new Angle(0);
    t.is(angle.value, 0);
    t.is(angle.rotate(90).value, 90);
    t.is(angle.rotate(90).value, 180);
    t.is(angle.rotate(90).value, 270);
    t.is(angle.rotate(90).value, 0);
});