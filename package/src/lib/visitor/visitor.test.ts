import { isStringLiteral, isImportDeclaration, factory } from 'typescript';
import { VisitorTransformer } from './visitor.ts';
import test from 'node:test';

test('JAjajJA', (t: test.TestContext) => {
    const transformer = new VisitorTransformer([
        node => {
            if (
                isStringLiteral(node) &&
                isImportDeclaration(node.parent)
            ) {
                return factory.createStringLiteral('REEE.ts');
            }
        }        
    ]);

    const result = transformer.transform(
        'pendejo.ts',
        [
            `import { hola, mundo } from '../joder/chaval.ts';`,
            ``,
            `export function visitor(x: number, y: number, text: string): void {`,
            `    console.log(text);`,
            `    console.log('x:', x);`,
            `    console.log('y:', y);`,
            `    console.log('');`,
            `}`,
        ].join('\n')
    );

    console.log(result);
});