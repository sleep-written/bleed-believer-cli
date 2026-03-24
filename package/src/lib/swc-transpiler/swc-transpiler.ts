import type {
    AssignmentPatternProperty, AssignmentProperty, ClassMethod, ClassProperty, Constructor,
    Declaration, Expression, GetterProperty, Import, KeyValuePatternProperty, KeyValueProperty,
    MethodProperty, ModuleDeclaration, Options, OptionalChainingCall, Output, Pattern,
    PrivateMethod, PrivateProperty, SetterProperty, SpreadElement, Statement, StaticBlock,
    Super, SwitchCase, TsIndexSignature, VariableDeclarator,
    ComputedPropName
} from '@swc/core';
import type { Visitor } from './interfaces/index.ts';
import { transform } from '@swc/core';

export class SWCTranspiler {
    #visitors: Visitor[];

    constructor(visitors?: Visitor[]) {
        this.#visitors = visitors ?? [];
    }

    transform(src: string, options: Options): Promise<Output> {
        return transform(src, {
            ...options,
            plugin: program => {
                for (const node of program.body) {
                    this.#visitors.forEach(x => this.#visit(x, node));
                }

                return program;
            }
        });
    }

    #visit(visitor: Visitor, node:
        | Expression | Declaration | ModuleDeclaration | Statement
        | Super | Import | Pattern | OptionalChainingCall | ComputedPropName
        | SpreadElement | KeyValueProperty | AssignmentProperty | GetterProperty | SetterProperty | MethodProperty
        | KeyValuePatternProperty | AssignmentPatternProperty
        | Constructor | ClassMethod | PrivateMethod | ClassProperty | PrivateProperty | StaticBlock
        | SwitchCase | TsIndexSignature | VariableDeclarator
    ): void {
        switch (node.type) {
            case 'IfStatement':
                this.#visit(visitor, node.test);
                this.#visit(visitor, node.consequent);
                node.alternate && this.#visit(visitor, node.alternate);
                visitor.ifStatement?.(node);
                break;

            case 'TryStatement':
                this.#visit(visitor, node.block);
                node.handler && this.#visit(visitor, node.handler.body);
                node.finalizer && this.#visit(visitor, node.finalizer);
                visitor.tryStatement?.(node);
                break;

            case 'ForStatement':
                node.init && this.#visit(visitor, node.init);
                node.test && this.#visit(visitor, node.test);
                node.update && this.#visit(visitor, node.update);
                this.#visit(visitor, node.body);
                visitor.forStatement?.(node);
                break;

            case 'WithStatement':
                this.#visit(visitor, node.object);
                this.#visit(visitor, node.body);
                visitor.withStatement?.(node);
                break;

            case 'StringLiteral':
                visitor.stringLiteral?.(node);
                break;

            case 'BlockStatement':
                node.stmts.forEach(x => this.#visit(visitor, x));
                visitor.blockStatement?.(node);
                break;

            case 'Import':
                visitor?.import?.(node);
                break;

            case 'CallExpression':
                this.#visit(visitor, node.callee);
                node.arguments.forEach(x => this.#visit(visitor, x.expression));
                visitor.callExpression?.(node);
                break;

            case 'ForInStatement':
                this.#visit(visitor, node.right);
                this.#visit(visitor, node.body);
                visitor.forInStatement?.(node);
                break;

            case 'ForOfStatement':
                this.#visit(visitor, node.right);
                this.#visit(visitor, node.body);
                visitor.forOfStatement?.(node);
                break;

            case 'WhileStatement':
                this.#visit(visitor, node.test);
                this.#visit(visitor, node.body);
                visitor.whileStatement?.(node);
                break;

            case 'SwitchStatement':
                this.#visit(visitor, node.discriminant);
                node.cases.forEach(c => this.#visit(visitor, c));
                visitor.switchStatement?.(node);
                break;

            case 'SwitchCase':
                node.test && this.#visit(visitor, node.test);
                node.consequent.forEach(s => this.#visit(visitor, s));
                visitor.switchCase?.(node);
                break;

            case 'ClassDeclaration':
                node.body.forEach(m => this.#visit(visitor, m));
                visitor.classDeclaration?.(node);
                break;

            case 'Identifier':
                visitor?.identifier?.(node);
                break;

            case 'BigIntLiteral':
                visitor?.bigIntLiteral?.(node);
                break;

            case 'NumericLiteral':
                visitor?.numericLiteral?.(node);
                break;

            case 'Computed':
                visitor?.computedPropName?.(node);
                this.#visit(visitor, node.expression);
                break;

            case 'Constructor':
                node.body && this.#visit(visitor, node.body);
                this.#visit(visitor, node.key);
                break;

            case 'ClassMethod':
                this.#visit(visitor, node.key);
                node.function.body && this.#visit(visitor, node.function.body);
                visitor.classMethod?.(node);
                break;

            case 'PrivateMethod':
                node.function.body && this.#visit(visitor, node.function.body);
                visitor.privateMethod?.(node);
                break;

            case 'ClassProperty':
                this.#visit(visitor, node.key);
                node.value && this.#visit(visitor, node.value);
                visitor.classProperty?.(node);
                break;

            case 'PrivateProperty':
                node.value && this.#visit(visitor, node.value);
                visitor.privateProperty?.(node);
                break;

            case 'StaticBlock':
                this.#visit(visitor, node.body);
                visitor.staticBlock?.(node);
                break;

            case 'DoWhileStatement':
                this.#visit(visitor, node.body);
                this.#visit(visitor, node.test);
                visitor.doWhileStatement?.(node);
                break;

            case 'LabeledStatement':
                this.#visit(visitor, node.body);
                visitor.labeledStatement?.(node);
                break;

            case 'ImportDeclaration':
                visitor.importDeclaration?.(node);
                break;

            case 'ExportDeclaration':
                visitor.exportDeclaration?.(node);
                break;

            case 'FunctionDeclaration':
                node.body && this.#visit(visitor, node.body);
                visitor.functionDeclaration?.(node);
                break;

            case 'ExpressionStatement':
                this.#visit(visitor, node.expression);
                visitor.expressionStatement?.(node);
                break;

            case 'ExportAllDeclaration':
                visitor.exportAllDeclaration?.(node);
                break;

            case 'ExportNamedDeclaration':
                visitor.exportNamedDeclaration?.(node);
                break;

            case 'ArrowFunctionExpression':
                this.#visit(visitor, node.body);
                visitor.arrowFunctionExpression?.(node);
                break;

            case 'ReturnStatement':
                node.argument && this.#visit(visitor, node.argument);
                visitor.returnStatement?.(node);
                break;

            case 'ConditionalExpression':
                this.#visit(visitor, node.test);
                this.#visit(visitor, node.consequent);
                this.#visit(visitor, node.alternate);
                visitor.conditionalExpression?.(node);
                break;

            case 'VariableDeclaration':
                node.declarations.forEach(d => this.#visit(visitor, d));
                visitor.variableDeclaration?.(node);
                break;

            case 'VariableDeclarator':
                this.#visit(visitor, node.id);
                node.init && this.#visit(visitor, node.init);
                visitor.variableDeclarator?.(node);
                break;

            case 'AwaitExpression':
                this.#visit(visitor, node.argument);
                visitor.awaitExpression?.(node);
                break;

            case 'AssignmentExpression':
                this.#visit(visitor, node.left);
                this.#visit(visitor, node.right);
                visitor.assignmentExpression?.(node);
                break;

            case 'BinaryExpression':
                this.#visit(visitor, node.left);
                this.#visit(visitor, node.right);
                visitor.binaryExpression?.(node);
                break;

            case 'UnaryExpression':
                this.#visit(visitor, node.argument);
                visitor.unaryExpression?.(node);
                break;

            case 'UpdateExpression':
                this.#visit(visitor, node.argument);
                visitor.updateExpression?.(node);
                break;

            case 'SequenceExpression':
                node.expressions.forEach(x => this.#visit(visitor, x));
                visitor.sequenceExpression?.(node);
                break;

            case 'MemberExpression':
                this.#visit(visitor, node.object);
                visitor.memberExpression?.(node);
                break;

            case 'OptionalChainingExpression':
                this.#visit(visitor, node.base);
                visitor.optionalChainingExpression?.(node);
                break;

            case 'NewExpression':
                this.#visit(visitor, node.callee);
                node.arguments?.forEach(x => this.#visit(visitor, x.expression));
                visitor.newExpression?.(node);
                break;

            case 'FunctionExpression':
                node.body && this.#visit(visitor, node.body);
                visitor.functionExpression?.(node);
                break;

            case 'ClassExpression':
                node.body.forEach(m => this.#visit(visitor, m));
                visitor.classExpression?.(node);
                break;

            case 'TemplateLiteral':
                node.expressions.forEach(x => this.#visit(visitor, x));
                visitor.templateLiteral?.(node);
                break;

            case 'TaggedTemplateExpression':
                this.#visit(visitor, node.tag);
                this.#visit(visitor, node.template);
                visitor.taggedTemplateExpression?.(node);
                break;

            case 'YieldExpression':
                node.argument && this.#visit(visitor, node.argument);
                visitor.yieldExpression?.(node);
                break;

            case 'ParenthesisExpression':
                this.#visit(visitor, node.expression);
                visitor.parenthesisExpression?.(node);
                break;

            case 'ArrayExpression':
                node.elements.forEach(x => x && this.#visit(visitor, x.expression));
                visitor.arrayExpression?.(node);
                break;

            case 'ObjectExpression':
                node.properties.forEach(p => this.#visit(visitor, p));
                visitor.objectExpression?.(node);
                break;

            case 'SpreadElement':
                this.#visit(visitor, node.arguments);
                visitor.spreadElement?.(node);
                break;

            case 'KeyValueProperty':
                this.#visit(visitor, node.key);
                this.#visit(visitor, node.value);
                visitor.keyValueProperty?.(node);
                break;

            case 'AssignmentProperty':
                this.#visit(visitor, node.value);
                visitor.assignmentProperty?.(node);
                break;

            case 'GetterProperty':
                this.#visit(visitor, node.key);
                node.body && this.#visit(visitor, node.body);
                visitor.getterProperty?.(node);
                break;

            case 'SetterProperty':
                this.#visit(visitor, node.key);
                this.#visit(visitor, node.param);
                node.body && this.#visit(visitor, node.body);
                visitor.setterProperty?.(node);
                break;

            case 'MethodProperty':
                this.#visit(visitor, node.key);
                node.body && this.#visit(visitor, node.body);
                visitor.methodProperty?.(node);
                break;

            case 'ThrowStatement':
                this.#visit(visitor, node.argument);
                visitor.throwStatement?.(node);
                break;

            case 'ExportDefaultDeclaration':
                this.#visit(visitor, node.decl);
                visitor.exportDefaultDeclaration?.(node);
                break;

            case 'ExportDefaultExpression':
                this.#visit(visitor, node.expression);
                visitor.exportDefaultExpression?.(node);
                break;

            case 'ArrayPattern':
                node.elements.forEach(e => e && this.#visit(visitor, e));
                visitor.arrayPattern?.(node);
                break;

            case 'ObjectPattern':
                node.properties.forEach(p => this.#visit(visitor, p));
                visitor.objectPattern?.(node);
                break;

            case 'KeyValuePatternProperty':
                this.#visit(visitor, node.key);
                this.#visit(visitor, node.value);
                visitor.keyValuePatternProperty?.(node);
                break;

            case 'AssignmentPatternProperty':
                node.value && this.#visit(visitor, node.value);
                visitor.assignmentPatternProperty?.(node);
                break;

            case 'AssignmentPattern':
                this.#visit(visitor, node.left);
                this.#visit(visitor, node.right);
                visitor.assignmentPattern?.(node);
                break;

            case 'RestElement':
                this.#visit(visitor, node.argument);
                visitor.restElement?.(node);
                break;
        }
    }
}
