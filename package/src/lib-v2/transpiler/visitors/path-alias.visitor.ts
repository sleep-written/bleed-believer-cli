import type { PathAliasVisitorInject, TsconfigObject, PathAliasObject } from './path-alias.visitor.inject.ts';
import type { CallExpression, StringLiteral } from 'typescript';
import type { VisitorObject } from '../interfaces/index.ts';

import { isStringLiteral, isImportDeclaration, isCallExpression, SyntaxKind, factory, isExportDeclaration } from 'typescript';
import { PathAlias } from '../../path-alias/index.ts';

export class PathAliasVisitor {
    #pathAlias: PathAliasObject;

    constructor(tsconfig: TsconfigObject, inject?: PathAliasVisitorInject) {
        const pathAliasConstructor = inject?.pathAlias?.bind(inject) ??  PathAlias;
        this.#pathAlias = new pathAliasConstructor(tsconfig);
    }

    callExpressionVisitor: VisitorObject<CallExpression> = {
        accept: n => (
            isCallExpression(n) &&
            n.expression.kind === SyntaxKind.ImportKeyword &&
            isStringLiteral(n.arguments[0])
        ),
        visit:  n => {
            const arg = n.arguments[0] as StringLiteral;
            const fileName = n.getSourceFile().fileName;
            const specifier = this.#pathAlias.resolve(arg.text, fileName);

            return factory.updateCallExpression(
                n, n.expression, n.typeArguments,
                [ factory.createStringLiteral(specifier, true) ]
            );
        }
    };

    stringLiteralVisitor: VisitorObject<StringLiteral> = {
        accept: n => (
            isStringLiteral(n) && (
                isImportDeclaration(n.parent) ||
                isExportDeclaration(n.parent)
            )
        ),
        visit:  n => {
            const fileName = n.getSourceFile().fileName;
            const specifier = this.#pathAlias.resolve(n.text, fileName);
            return factory.createStringLiteral(specifier, true);
        }
    };
}