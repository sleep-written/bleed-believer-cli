import type { Node, TransformerFactory, SourceFile, TransformationContext } from 'typescript';

import { createSourceFile, ScriptTarget, visitNode, transform, createPrinter, NewLineKind, visitEachChild } from 'typescript';
import { basename } from 'node:path';

export type Visitor<N extends Node> = (n: N, c: TransformationContext) => N | undefined;

export class VisitorTransformer {
    #visitors: Visitor<SourceFile | Node>[];

    constructor(visitors: Visitor<SourceFile | Node>[]) {
        this.#visitors = visitors;
    }

    transform(path: string, code: string): string {
        const source = createSourceFile(basename(path), code, ScriptTarget.ES2025, true);
        const transformer: TransformerFactory<SourceFile> = context => {
            return node => {
                for (const rawVisitor of this.#visitors) {
                    const visitor = (n: Node) => (
                        rawVisitor(n, context) ??
                        visitEachChild(n, visitor, context)
                    );

                    node = visitNode(node, visitor) as SourceFile;
                }

                return node;
            };
        }

        const result = transform(source, [ transformer ]);
        const printer = createPrinter({
            newLine: NewLineKind.LineFeed,
            removeComments: false
        });

        return printer.printFile(result.transformed[0]);
    }
}