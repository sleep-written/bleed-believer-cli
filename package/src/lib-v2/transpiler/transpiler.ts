import type { TsconfigObject, VisitorObject, VisitorContext } from './interfaces/index.ts';
import type { TransformerFactory, SourceFile, Visitor } from 'typescript';

import { createSourceFile, ScriptTarget, transform, createPrinter, NewLineKind, visitEachChild, visitNode } from 'typescript';
import { basename } from 'node:path';

export class Transpiler {
    #visitors: VisitorObject[];
    #tsconfig: TsconfigObject;

    constructor(tsconfig: TsconfigObject, ...visitors: VisitorObject[]) {
        this.#tsconfig = tsconfig;
        this.#visitors = visitors;
    }

    #createTransformerFactory(visitorContext: VisitorContext): TransformerFactory<SourceFile> {
        // The factory
        return context => {
            // The native visitor
            return sourceFile => {
                // My custom visitor mechanism
                for (const visitorObject of this.#visitors) {
                    const visitor: Visitor = node => {
                        if (visitorObject.accept(node)) {
                            const result = visitorObject.visit(node, visitorContext);
                            if (result) {
                                node = result;
                            }
                        }

                        return visitEachChild(node, visitor, context);
                    };

                    sourceFile = visitEachChild(sourceFile, visitor, context);
                }
    
                return sourceFile;
            };
        };
    }

    transform(path: string, code: string): string {
        const context: VisitorContext = {
            filename: path,
            tsconfig: this.#tsconfig
        };
        
        const target = this.#tsconfig.options.target ?? ScriptTarget.ES2025;
        const result = transform(
            createSourceFile(basename(path), code, target, true),
            [ this.#createTransformerFactory(context) ]
        );

        const printer = createPrinter({
            newLine: NewLineKind.LineFeed,
            removeComments: false
        });

        return printer.printFile(result.transformed[0]);
    }
}