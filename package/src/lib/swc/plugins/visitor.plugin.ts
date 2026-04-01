import type { Expression, ModuleItem, Program, Statement } from '@swc/core';
import type { SWCPlugin, SWCPluginContext } from '../interfaces/index.ts';
import type { Visitor } from '../interfaces/visitor.ts';

export class VisitorPlugin implements SWCPlugin {
    #visitor: Visitor;

    constructor(visitor: Visitor) {
        this.#visitor = visitor;
    }

    transform(program: Program, context: SWCPluginContext): Program {
        for (let i = 0; i < program.body.length; i++) {
            program.body[i] = this.#visit(program.body[i], context);
        }

        return program;
    }

    #visit<N extends ModuleItem | Statement | Expression>(node: N, context: SWCPluginContext): N {
        switch (node.type) {
            // Module items
            case 'ImportDeclaration':
                return (this.#visitor.onImportDeclaration?.(node, context) ?? node) as N;

            case 'ExportDeclaration':
                node.declaration = this.#visit(node.declaration, context);
                return (this.#visitor.onExportDeclaration?.(node, context) ?? node) as N;

            case 'ExportNamedDeclaration':
                return (this.#visitor.onExportNamedDeclaration?.(node, context) ?? node) as N;

            case 'ExportDefaultDeclaration':
                return (this.#visitor.onExportDefaultDeclaration?.(node, context) ?? node) as N;

            case 'ExportDefaultExpression': {
                node.expression = this.#visit(node.expression, context);
                return (this.#visitor.onExportDefaultExpression?.(node, context) ?? node) as N;
            }

            case 'ExportAllDeclaration':
                return (this.#visitor.onExportAllDeclaration?.(node, context) ?? node) as N;

            // Statements
            case 'BlockStatement': {
                for (let i = 0; i < node.stmts.length; i++) {
                    node.stmts[i] = this.#visit(node.stmts[i], context);
                }
                return (this.#visitor.onBlockStatement?.(node, context) ?? node) as N;
            }

            case 'IfStatement': {
                if (node.alternate) {
                    node.alternate = this.#visit(node.alternate, context);
                }
                node.test = this.#visit(node.test, context);
                node.consequent = this.#visit(node.consequent, context);
                return (this.#visitor.onIfStatement?.(node, context) ?? node) as N;
            }

            case 'ReturnStatement': {
                if (node.argument) {
                    node.argument = this.#visit(node.argument, context);
                }
                return (this.#visitor.onReturnStatement?.(node, context) ?? node) as N;
            }

            case 'ExpressionStatement': {
                node.expression = this.#visit(node.expression, context);
                return (this.#visitor.onExpressionStatement?.(node, context) ?? node) as N;
            }

            case 'VariableDeclaration': {
                for (const decl of node.declarations) {
                    if (decl.init) {
                        decl.init = this.#visit(decl.init, context);
                    }
                }
                return (this.#visitor.onVariableDeclaration?.(node, context) ?? node) as N;
            }

            case 'ForStatement': {
                if (node.init) {
                    node.init = this.#visit(node.init as Expression, context);
                }
                if (node.test) {
                    node.test = this.#visit(node.test, context);
                }
                if (node.update) {
                    node.update = this.#visit(node.update, context);
                }
                node.body = this.#visit(node.body, context);
                return (this.#visitor.onForStatement?.(node, context) ?? node) as N;
            }

            case 'ForInStatement': {
                node.right = this.#visit(node.right, context);
                node.body = this.#visit(node.body, context);
                return (this.#visitor.onForInStatement?.(node, context) ?? node) as N;
            }

            case 'ForOfStatement': {
                node.right = this.#visit(node.right, context);
                node.body = this.#visit(node.body, context);
                return (this.#visitor.onForOfStatement?.(node, context) ?? node) as N;
            }

            case 'WhileStatement': {
                node.test = this.#visit(node.test, context);
                node.body = this.#visit(node.body, context);
                return (this.#visitor.onWhileStatement?.(node, context) ?? node) as N;
            }

            case 'DoWhileStatement': {
                node.body = this.#visit(node.body, context);
                node.test = this.#visit(node.test, context);
                return (this.#visitor.onDoWhileStatement?.(node, context) ?? node) as N;
            }

            case 'SwitchStatement': {
                node.discriminant = this.#visit(node.discriminant, context);
                for (const c of node.cases) {
                    if (c.test) {
                        c.test = this.#visit(c.test, context);
                    }
                    for (let i = 0; i < c.consequent.length; i++) {
                        c.consequent[i] = this.#visit(c.consequent[i], context);
                    }
                }
                return (this.#visitor.onSwitchStatement?.(node, context) ?? node) as N;
            }

            case 'TryStatement': {
                node.block = this.#visit(node.block, context);
                if (node.handler) {
                    node.handler.body = this.#visit(node.handler.body, context);
                }
                if (node.finalizer) {
                    node.finalizer = this.#visit(node.finalizer, context);
                }
                return (this.#visitor.onTryStatement?.(node, context) ?? node) as N;
            }

            case 'ThrowStatement': {
                node.argument = this.#visit(node.argument, context);
                return (this.#visitor.onThrowStatement?.(node, context) ?? node) as N;
            }

            case 'BreakStatement':
                return (this.#visitor.onBreakStatement?.(node, context) ?? node) as N;

            case 'ContinueStatement':
                return (this.#visitor.onContinueStatement?.(node, context) ?? node) as N;

            case 'LabeledStatement': {
                node.body = this.#visit(node.body, context);
                return (this.#visitor.onLabeledStatement?.(node, context) ?? node) as N;
            }

            case 'FunctionDeclaration': {
                if (node.body) {
                    node.body = this.#visit(node.body, context);
                }
                return (this.#visitor.onFunctionDeclaration?.(node, context) ?? node) as N;
            }

            case 'ClassDeclaration':
                return (this.#visitor.onClassDeclaration?.(node, context) ?? node) as N;

            // Expressions
            case 'CallExpression': {
                if (node.callee.type !== 'Super' && node.callee.type !== 'Import') {
                    node.callee = this.#visit(node.callee, context);
                }
                for (const arg of node.arguments) {
                    arg.expression = this.#visit(arg.expression, context);
                }
                return (this.#visitor.onCallExpression?.(node, context) ?? node) as N;
            }

            case 'MemberExpression': {
                node.object = this.#visit(node.object, context);
                return (this.#visitor.onMemberExpression?.(node, context) ?? node) as N;
            }

            case 'ArrowFunctionExpression': {
                node.body = this.#visit(node.body as Expression, context);
                return (this.#visitor.onArrowFunctionExpression?.(node, context) ?? node) as N;
            }

            case 'FunctionExpression': {
                if (node.body) {
                    node.body = this.#visit(node.body, context);
                }
                return (this.#visitor.onFunctionExpression?.(node, context) ?? node) as N;
            }

            case 'ClassExpression':
                return (this.#visitor.onClassExpression?.(node, context) ?? node) as N;

            case 'BinaryExpression': {
                node.left = this.#visit(node.left, context);
                node.right = this.#visit(node.right, context);
                return (this.#visitor.onBinaryExpression?.(node, context) ?? node) as N;
            }

            case 'AssignmentExpression': {
                node.right = this.#visit(node.right, context);
                return (this.#visitor.onAssignmentExpression?.(node, context) ?? node) as N;
            }

            case 'ConditionalExpression': {
                node.test = this.#visit(node.test, context);
                node.consequent = this.#visit(node.consequent, context);
                node.alternate = this.#visit(node.alternate, context);
                return (this.#visitor.onConditionalExpression?.(node, context) ?? node) as N;
            }

            case 'AwaitExpression': {
                node.argument = this.#visit(node.argument, context);
                return (this.#visitor.onAwaitExpression?.(node, context) ?? node) as N;
            }

            case 'YieldExpression': {
                if (node.argument) {
                    node.argument = this.#visit(node.argument, context);
                }
                return (this.#visitor.onYieldExpression?.(node, context) ?? node) as N;
            }

            case 'NewExpression': {
                node.callee = this.#visit(node.callee, context);
                if (node.arguments) {
                    for (const arg of node.arguments) {
                        arg.expression = this.#visit(arg.expression, context);
                    }
                }
                return (this.#visitor.onNewExpression?.(node, context) ?? node) as N;
            }

            case 'SequenceExpression': {
                for (let i = 0; i < node.expressions.length; i++) {
                    node.expressions[i] = this.#visit(node.expressions[i], context);
                }
                return (this.#visitor.onSequenceExpression?.(node, context) ?? node) as N;
            }

            case 'UnaryExpression': {
                node.argument = this.#visit(node.argument, context);
                return (this.#visitor.onUnaryExpression?.(node, context) ?? node) as N;
            }

            case 'UpdateExpression': {
                node.argument = this.#visit(node.argument, context);
                return (this.#visitor.onUpdateExpression?.(node, context) ?? node) as N;
            }

            case 'ObjectExpression':
                return (this.#visitor.onObjectExpression?.(node, context) ?? node) as N;

            case 'ArrayExpression': {
                for (const el of node.elements) {
                    if (el) {
                        el.expression = this.#visit(el.expression, context);
                    }
                }
                return (this.#visitor.onArrayExpression?.(node, context) ?? node) as N;
            }

            case 'TemplateLiteral': {
                for (let i = 0; i < node.expressions.length; i++) {
                    node.expressions[i] = this.#visit(node.expressions[i] as Expression, context);
                }
                return (this.#visitor.onTemplateLiteral?.(node, context) ?? node) as N;
            }

            case 'TaggedTemplateExpression': {
                node.tag = this.#visit(node.tag, context);
                return (this.#visitor.onTaggedTemplateExpression?.(node, context) ?? node) as N;
            }

            case 'ParenthesisExpression': {
                node.expression = this.#visit(node.expression, context);
                return (this.#visitor.onParenthesisExpression?.(node, context) ?? node) as N;
            }

            case 'OptionalChainingExpression':
                node.base = this.#visit(node.base, context);
                return (this.#visitor.onOptionalChainingExpression?.(node, context) ?? node) as N;

            case 'SuperPropExpression':
                return (this.#visitor.onSuperPropExpression?.(node, context) ?? node) as N;

            case 'Identifier':
                return (this.#visitor.onIdentifier?.(node, context) ?? node) as N;

            case 'StringLiteral':
                return (this.#visitor.onStringLiteral?.(node, context) ?? node) as N;

            case 'NumericLiteral':
                return (this.#visitor.onNumericLiteral?.(node, context) ?? node) as N;

            case 'BooleanLiteral':
                return (this.#visitor.onBooleanLiteral?.(node, context) ?? node) as N;

            case 'NullLiteral':
                return (this.#visitor.onNullLiteral?.(node, context) ?? node) as N;

            case 'TsAsExpression': {
                node.expression = this.#visit(node.expression, context);
                return (this.#visitor.onTsAsExpression?.(node, context) ?? node) as N;
            }

            case 'TsSatisfiesExpression': {
                node.expression = this.#visit(node.expression, context);
                return (this.#visitor.onTsSatisfiesExpression?.(node, context) ?? node) as N;
            }

            case 'TsNonNullExpression': {
                node.expression = this.#visit(node.expression, context);
                return (this.#visitor.onTsNonNullExpression?.(node, context) ?? node) as N;
            }

            case 'TsTypeAssertion': {
                node.expression = this.#visit(node.expression, context);
                return (this.#visitor.onTsTypeAssertion?.(node, context) ?? node) as N;
            }

            case 'TsConstAssertion': {
                node.expression = this.#visit(node.expression, context);
                return (this.#visitor.onTsConstAssertion?.(node, context) ?? node) as N;
            }

            default:
                return node;
        }
    }
}