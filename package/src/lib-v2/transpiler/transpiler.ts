import type { TransformationContext, SourceFile, Visitor, Transformer, Node } from 'typescript';
import type { TranspilerInject, TsconfigObject, VisitorObject } from './interfaces/index.ts';

import { getImpliedNodeFormatForFile, sys, ModuleKind, ModuleResolutionKind } from 'typescript';
import { visitEachChild, transpileModule, JSDocParsingMode, visitNode } from 'typescript';
import { dirname, parse, resolve } from 'node:path';
import { readFile } from 'node:fs/promises';

export class Transpiler {
    static createVisitor<N extends Node>(
        accept: VisitorObject<N>['accept'],
        visit: VisitorObject<N>['visit'],
    ): VisitorObject<N> {
        return { accept, visit };
    }

    #injected: Required<TranspilerInject>;
    #tsconfig: TsconfigObject;
    #visitors: VisitorObject[];

    constructor(
        tsconfig: TsconfigObject,
        visitors?: VisitorObject[],
        inject?: TranspilerInject
    ) {
        this.#tsconfig = tsconfig;
        this.#visitors = visitors ?? [];
        this.#injected = {
            getImpliedNodeFormatForFile: (
                inject?.getImpliedNodeFormatForFile?.bind(inject) ??
                getImpliedNodeFormatForFile
            ),

            readFile:   inject?.readFile?.bind(inject)  ?? readFile,
            resolve:    inject?.resolve?.bind(inject)   ?? resolve,
            dirname:    inject?.dirname?.bind(inject)   ?? dirname,
            parse:      inject?.parse?.bind(inject)     ?? parse,
        };
    }

    #transformer(context: TransformationContext): Transformer<SourceFile> {
        // The native visitor
        return sourceFile => {
            // My custom visitor mechanism
            for (const visitorObject of this.#visitors) {
                const visitor: Visitor = node => {
                    if (visitorObject.accept(node)) {
                        return visitorObject.visit(node);
                    }

                    return visitEachChild(node, visitor, context);
                };

                sourceFile = visitNode(sourceFile, visitor) as SourceFile;
            }

            return sourceFile;
        };
    }

    async transform(path: string): Promise<{ code: string; map?: string; }> {
        const source = await this.#injected.readFile(path, 'utf-8');
        const module = this.#injected.getImpliedNodeFormatForFile(
            path, undefined, sys,
            this.#tsconfig.options
        );

        const { outputText, sourceMapText, diagnostics } = transpileModule(source, {
            compilerOptions: {
                ...this.#tsconfig.options,
                moduleResolution: module === ModuleKind.ESNext
                ?   ModuleResolutionKind.Bundler
                :   this.#tsconfig.options.moduleResolution,
                module
            },
            transformers: {
                before: [ this.#transformer.bind(this)  ]
            },
            reportDiagnostics: true,
            jsDocParsingMode: JSDocParsingMode.ParseAll,
            moduleName: this.#injected.parse(path).name,
            fileName: path
        });

        const [ except ] = diagnostics ?? [];
        if (except) {
            throw new Error(except.messageText.toString());
        }

        return {
            code: outputText,
            map: sourceMapText
        };
    }
}