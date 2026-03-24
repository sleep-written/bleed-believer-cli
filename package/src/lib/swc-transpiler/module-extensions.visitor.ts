import type { CallExpression, ExportAllDeclaration, ExportNamedDeclaration, ImportDeclaration } from '@swc/core';
import type { Visitor } from './interfaces/index.ts';

export class ModuleExtensionsVisitor implements Visitor {
    #toJs: boolean;

    constructor(toJs: boolean) {
        this.#toJs = toJs;
    }

    #replaceExtension(value: string): string {
        if (this.#toJs) {
            return value.replace(
                /(?<=\.(?:m|c)?)t(?=sx?$)/i,
                v => v === v.toUpperCase()
                ?   'J'
                :   'j'
            );
        } else {
            return value.replace(
                /(?<=\.(?:m|c)?)j(?=sx?$)/i,
                v => v === v.toUpperCase()
                ?   'T'
                :   't'
            );
        }
    }

    exportAllDeclaration(node: ExportAllDeclaration): void {
        if (node.source.type === 'StringLiteral') {
            node.source.value = this.#replaceExtension(node.source.value);
        }
    }

    exportNamedDeclaration(node: ExportNamedDeclaration): void {
        if (node.source?.type === 'StringLiteral') {
            node.source.value = this.#replaceExtension(node.source.value);
        }
    }
    
    importDeclaration(node: ImportDeclaration): void {
        if (node.source.type === 'StringLiteral') {
            node.source.value = this.#replaceExtension(node.source.value);
        }
    }

    callExpression(node: CallExpression): void {
        if (
            node.callee.type === 'Import' &&
            node.arguments[0]?.expression?.type === 'StringLiteral'
        ) {
            const expression = node.arguments[0].expression;
            expression.value = this.#replaceExtension(expression.value);
        }
    }
}