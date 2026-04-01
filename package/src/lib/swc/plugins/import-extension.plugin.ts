import type { CallExpression, ExportAllDeclaration, ExportNamedDeclaration, ImportDeclaration, Program } from '@swc/core';
import type { SWCPlugin, SWCPluginContext, TsconfigObject, Visitor } from '../interfaces/index.ts';

import { dirname, relative, resolve, sep } from 'path';
import { VisitorPlugin } from './visitor.plugin.ts';
import { SourceFile } from '../../source-file/index.ts';

export class ImportExtensionPlugin implements SWCPlugin, Visitor {
    #tsconfig: TsconfigObject;
    #rootDir: string;
    #outDir: string;

    constructor(tsconfig: TsconfigObject) {
        this.#tsconfig = tsconfig;
        this.#rootDir = resolve(
            dirname(tsconfig.path),
            tsconfig.json.compilerOptions?.rootDir ?? '.'
        ) + sep;

        this.#outDir = resolve(
            dirname(tsconfig.path),
            tsconfig.json.compilerOptions?.outDir ?? '.'
        ) + sep;
    }

    transform(program: Program, context: SWCPluginContext): Program {
        const plugin = new VisitorPlugin(this);
        return plugin.transform(program, context);
    }

    #resolveValue(input: string, context: SWCPluginContext): string {
        const path = resolve(dirname(context.srcPath), input);
        const file = new SourceFile(path);
        if (file.existsSync() && (file.isTs || file.isJs)) {
            return typeof context.outPath === 'string'
            ?   SourceFile.toJsExt(input)
            :   SourceFile.toTsExt(input);
        }

        const paths = this.#tsconfig.resolve(input);
        for (const path of paths ?? []) {
            const file = new SourceFile(path.replace(this.#outDir, this.#rootDir)).toTsExt();
            if (!file.existsSync()) {
                continue;
            }

            if (typeof context.outPath === 'string') {
                const output = file
                    .toJsExt().path
                    .replace(this.#rootDir, this.#outDir);

                return relative(context.outPath, output).replace(/\\/g, '/');
            } else {
                const output = file.path;
                return relative(context.srcPath, output).replace(/\\/g, '/');
            }
        }

        return input;
    }

    onCallExpression(node: CallExpression, context: SWCPluginContext): CallExpression {
        const exp = node.arguments[0]?.expression;
        if (node.callee.type === 'Import' && exp?.type === 'StringLiteral') {
            const newValue = this.#resolveValue(exp.value, context);
            exp.raw = exp.raw?.replace(exp.value, newValue);
            exp.value = newValue;
        }

        return node;
    }

    onImportDeclaration(node: ImportDeclaration, context: SWCPluginContext): ImportDeclaration {
        const newValue = this.#resolveValue(node.source.value, context);
        node.source.raw = node.source.raw?.replace(node.source.value, newValue);
        node.source.value = newValue;
        return node;
    }

    onExportNamedDeclaration(node: ExportNamedDeclaration, context: SWCPluginContext): ExportNamedDeclaration {
        if (node.source) {
            const newValue = this.#resolveValue(node.source.value, context);
            node.source.raw = node.source.raw?.replace(node.source.value, newValue);
            node.source.value = newValue;
        }

        return node;
    }

    onExportAllDeclaration(node: ExportAllDeclaration, context: SWCPluginContext): ExportAllDeclaration {
        const newValue = this.#resolveValue(node.source.value, context);
        node.source.raw = node.source.raw?.replace(node.source.value, newValue);
        node.source.value = newValue;
        return node;
    }
}