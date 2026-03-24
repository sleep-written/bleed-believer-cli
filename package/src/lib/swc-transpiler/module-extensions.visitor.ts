import type { CallExpression, ExportAllDeclaration, ExportNamedDeclaration, ImportDeclaration } from '@swc/core';
import type { Visitor } from './interfaces/index.ts';

export class ModuleExtensionsVisitor implements Visitor {
    static replaceExtension(value: string, toJs?: boolean): string {
        if (toJs) {
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

    #toJs: boolean;

    constructor(toJs: boolean) {
        this.#toJs = toJs;
    }

    exportAllDeclaration(node: ExportAllDeclaration): void {
        if (node.source.type === 'StringLiteral') {
            node.source.value = ModuleExtensionsVisitor.replaceExtension(
                node.source.value,
                this.#toJs
            );
        }
    }

    exportNamedDeclaration(node: ExportNamedDeclaration): void {
        if (node.source?.type === 'StringLiteral') {
            node.source.value = ModuleExtensionsVisitor.replaceExtension(
                node.source.value,
                this.#toJs
            );
        }
    }
    
    importDeclaration(node: ImportDeclaration): void {
        if (node.source.type === 'StringLiteral') {
            node.source.value = ModuleExtensionsVisitor.replaceExtension(
                node.source.value,
                this.#toJs
            );
        }
    }

    callExpression(node: CallExpression): void {
        if (
            node.callee.type === 'Import' &&
            node.arguments[0]?.expression?.type === 'StringLiteral'
        ) {
            const expression = node.arguments[0].expression;
            expression.value = ModuleExtensionsVisitor.replaceExtension(
                expression.value,
                this.#toJs
            );
        }
    }
}