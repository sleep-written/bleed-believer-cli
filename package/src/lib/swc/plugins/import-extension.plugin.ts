import type { CallExpression, ImportDeclaration, Program } from '@swc/core';
import type { SWCPlugin, SWCPluginContext, Visitor } from '../interfaces/index.ts';

import { dirname, resolve } from 'path';
import { VisitorPlugin } from './visitor.plugin.ts';
import { SourceFile } from '../../source-file/index.ts';

export class ImportExtensionPlugin implements SWCPlugin, Visitor {
    transform(program: Program, context: SWCPluginContext): Program {
        const plugin = new VisitorPlugin(this);
        return plugin.transform(program, context);
    }

    #resolveValue(input: string, context: SWCPluginContext): string {
        const path = resolve(dirname(context.srcPath), input);
        const file = new SourceFile(path).toTsExt();
        if (file.isTs || file.isJs && file.existsSync()) {
            return typeof context.outPath === 'string'
            ?   SourceFile.toJsExt(input)
            :   SourceFile.toTsExt(input);
        }

        return input;
    }

    onCallExpression(node: CallExpression, context: SWCPluginContext): CallExpression {
        const exp = node.arguments[0]?.expression;
        if (node.callee.type === 'Import' && exp?.type === 'StringLiteral') {
            exp.value = this.#resolveValue(exp.value, context);
        }

        return node;
    }

    onImportDeclaration(node: ImportDeclaration, context: SWCPluginContext): ImportDeclaration {
        node.source.value = this.#resolveValue(node.source.value, context);
        return node;
    }
}