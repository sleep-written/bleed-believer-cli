import { Screen } from '@lib/screen/index.js';
import { fibonacci } from '@lib/fibonacci/index.js';
import { Angle } from '@lib/angle/index.js';
import { Snake } from '@lib/snake/index.js';

const screen = new Screen({ width: 50, height: 35 });
const color = '#ff6200';
const snake = new Snake(color);
const angle = new Angle(0);

for (const value of fibonacci(10)) {
    switch (angle.value) {
        case   0: {
            snake.right(value, color);
            break;
        }

        case 270: {
            snake.down(value, color);
            break;
        }

        case 180: {
            snake.left(value, color);
            break;
        }

        case  90: {
            snake.up(value, color);
            break;
        }
    }

    angle.rotate(-90);
}


console.clear();
console.log('Aprecien la magnificiencia del espiral de fibonacci:');

let ms = 10;
let loop = true;
let position = 0;
let direction = 1;
process.once('SIGINT', () => { loop = false });

while (loop) {
    const segments = snake.segments.slice(0, position + 1);
    position += direction;

    screen.clear();
    for (const { x, y, value } of segments) {
        screen.add(x, y, value);
    }

    process.stdout.cursorTo(0, 1);
    process.stdout.write(screen.toString() + '\n');
    await new Promise(r => setTimeout(r, ms));

    if (position < 0 || position === snake.segments.length) {
        direction *= -1;
    }
}

process.exit();