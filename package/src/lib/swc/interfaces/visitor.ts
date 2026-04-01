import type {
    ArrayExpression, ArrowFunctionExpression, AssignmentExpression,
    AwaitExpression, BinaryExpression, BlockStatement, BooleanLiteral,
    BreakStatement, CallExpression, ClassDeclaration, ClassExpression,
    ConditionalExpression, ContinueStatement, DoWhileStatement,
    ExportAllDeclaration, ExportDeclaration, ExportDefaultDeclaration, ExportDefaultExpression,
    ExportNamedDeclaration, ExpressionStatement, ForInStatement,
    ForOfStatement, ForStatement, FunctionDeclaration, FunctionExpression,
    Identifier, IfStatement, ImportDeclaration, LabeledStatement,
    MemberExpression, NewExpression, NullLiteral, NumericLiteral,
    ObjectExpression, OptionalChainingExpression, ParenthesisExpression,
    ReturnStatement, SequenceExpression, StringLiteral, SuperPropExpression,
    SwitchStatement, TaggedTemplateExpression, TemplateLiteral,
    ThrowStatement, TryStatement, TsAsExpression, TsConstAssertion,
    TsNonNullExpression, TsSatisfiesExpression, TsTypeAssertion,
    UnaryExpression, UpdateExpression, VariableDeclaration, WhileStatement,
    YieldExpression
} from '@swc/core';
import type { SWCPluginContext } from './index.ts';

export interface Visitor {
    // Module items
    onImportDeclaration?(node: ImportDeclaration, context: SWCPluginContext): ImportDeclaration;
    onExportDeclaration?(node: ExportDeclaration, context: SWCPluginContext): ExportDeclaration;
    onExportNamedDeclaration?(node: ExportNamedDeclaration, context: SWCPluginContext): ExportNamedDeclaration;
    onExportDefaultDeclaration?(node: ExportDefaultDeclaration, context: SWCPluginContext): ExportDefaultDeclaration;
    onExportDefaultExpression?(node: ExportDefaultExpression, context: SWCPluginContext): ExportDefaultExpression;
    onExportAllDeclaration?(node: ExportAllDeclaration, context: SWCPluginContext): ExportAllDeclaration;

    // Statements
    onBlockStatement?(node: BlockStatement, context: SWCPluginContext): BlockStatement;
    onIfStatement?(node: IfStatement, context: SWCPluginContext): IfStatement;
    onReturnStatement?(node: ReturnStatement, context: SWCPluginContext): ReturnStatement;
    onExpressionStatement?(node: ExpressionStatement, context: SWCPluginContext): ExpressionStatement;
    onVariableDeclaration?(node: VariableDeclaration, context: SWCPluginContext): VariableDeclaration;
    onForStatement?(node: ForStatement, context: SWCPluginContext): ForStatement;
    onForInStatement?(node: ForInStatement, context: SWCPluginContext): ForInStatement;
    onForOfStatement?(node: ForOfStatement, context: SWCPluginContext): ForOfStatement;
    onWhileStatement?(node: WhileStatement, context: SWCPluginContext): WhileStatement;
    onDoWhileStatement?(node: DoWhileStatement, context: SWCPluginContext): DoWhileStatement;
    onSwitchStatement?(node: SwitchStatement, context: SWCPluginContext): SwitchStatement;
    onTryStatement?(node: TryStatement, context: SWCPluginContext): TryStatement;
    onThrowStatement?(node: ThrowStatement, context: SWCPluginContext): ThrowStatement;
    onBreakStatement?(node: BreakStatement, context: SWCPluginContext): BreakStatement;
    onContinueStatement?(node: ContinueStatement, context: SWCPluginContext): ContinueStatement;
    onLabeledStatement?(node: LabeledStatement, context: SWCPluginContext): LabeledStatement;
    onFunctionDeclaration?(node: FunctionDeclaration, context: SWCPluginContext): FunctionDeclaration;
    onClassDeclaration?(node: ClassDeclaration, context: SWCPluginContext): ClassDeclaration;

    // Expressions
    onCallExpression?(node: CallExpression, context: SWCPluginContext): CallExpression;
    onMemberExpression?(node: MemberExpression, context: SWCPluginContext): MemberExpression;
    onArrowFunctionExpression?(node: ArrowFunctionExpression, context: SWCPluginContext): ArrowFunctionExpression;
    onFunctionExpression?(node: FunctionExpression, context: SWCPluginContext): FunctionExpression;
    onClassExpression?(node: ClassExpression, context: SWCPluginContext): ClassExpression;
    onBinaryExpression?(node: BinaryExpression, context: SWCPluginContext): BinaryExpression;
    onAssignmentExpression?(node: AssignmentExpression, context: SWCPluginContext): AssignmentExpression;
    onConditionalExpression?(node: ConditionalExpression, context: SWCPluginContext): ConditionalExpression;
    onAwaitExpression?(node: AwaitExpression, context: SWCPluginContext): AwaitExpression;
    onYieldExpression?(node: YieldExpression, context: SWCPluginContext): YieldExpression;
    onNewExpression?(node: NewExpression, context: SWCPluginContext): NewExpression;
    onSequenceExpression?(node: SequenceExpression, context: SWCPluginContext): SequenceExpression;
    onUnaryExpression?(node: UnaryExpression, context: SWCPluginContext): UnaryExpression;
    onUpdateExpression?(node: UpdateExpression, context: SWCPluginContext): UpdateExpression;
    onObjectExpression?(node: ObjectExpression, context: SWCPluginContext): ObjectExpression;
    onArrayExpression?(node: ArrayExpression, context: SWCPluginContext): ArrayExpression;
    onTemplateLiteral?(node: TemplateLiteral, context: SWCPluginContext): TemplateLiteral;
    onTaggedTemplateExpression?(node: TaggedTemplateExpression, context: SWCPluginContext): TaggedTemplateExpression;
    onParenthesisExpression?(node: ParenthesisExpression, context: SWCPluginContext): ParenthesisExpression;
    onOptionalChainingExpression?(node: OptionalChainingExpression, context: SWCPluginContext): OptionalChainingExpression;
    onSuperPropExpression?(node: SuperPropExpression, context: SWCPluginContext): SuperPropExpression;
    onIdentifier?(node: Identifier, context: SWCPluginContext): Identifier;
    onStringLiteral?(node: StringLiteral, context: SWCPluginContext): StringLiteral;
    onNumericLiteral?(node: NumericLiteral, context: SWCPluginContext): NumericLiteral;
    onBooleanLiteral?(node: BooleanLiteral, context: SWCPluginContext): BooleanLiteral;
    onNullLiteral?(node: NullLiteral, context: SWCPluginContext): NullLiteral;
    onTsAsExpression?(node: TsAsExpression, context: SWCPluginContext): TsAsExpression;
    onTsSatisfiesExpression?(node: TsSatisfiesExpression, context: SWCPluginContext): TsSatisfiesExpression;
    onTsNonNullExpression?(node: TsNonNullExpression, context: SWCPluginContext): TsNonNullExpression;
    onTsTypeAssertion?(node: TsTypeAssertion, context: SWCPluginContext): TsTypeAssertion;
    onTsConstAssertion?(node: TsConstAssertion, context: SWCPluginContext): TsConstAssertion;
}
