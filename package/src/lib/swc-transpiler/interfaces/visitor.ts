import type {
    ArrayExpression, ArrayPattern, ArrowFunctionExpression, AssignmentExpression,
    AssignmentPattern, AssignmentPatternProperty, AssignmentProperty, AwaitExpression,
    BinaryExpression, BlockStatement, CallExpression, ClassDeclaration, ClassExpression,
    ClassMethod, ClassProperty, ConditionalExpression, Constructor, DoWhileStatement,
    ExportAllDeclaration, ExportDeclaration, ExportDefaultDeclaration, ExportDefaultExpression,
    ExportNamedDeclaration, ExpressionStatement, ForInStatement, ForOfStatement, ForStatement,
    FunctionDeclaration, FunctionExpression, GetterProperty, IfStatement, ImportDeclaration,
    KeyValuePatternProperty, KeyValueProperty, LabeledStatement, MemberExpression, MethodProperty,
    NewExpression, ObjectExpression, ObjectPattern, OptionalChainingExpression,
    ParenthesisExpression, PrivateMethod, PrivateProperty, RestElement, ReturnStatement,
    SequenceExpression, SetterProperty, SpreadElement, StaticBlock, StringLiteral,
    SwitchCase, SwitchStatement, TaggedTemplateExpression, TemplateLiteral, ThrowStatement,
    TryStatement, UnaryExpression, UpdateExpression, VariableDeclaration, VariableDeclarator,
    WhileStatement, WithStatement, YieldExpression, Identifier,
    NumericLiteral, BigIntLiteral, ComputedPropName,
    Import
} from '@swc/core';

export interface Visitor {
    import?(node: Import): void;
    identifier?(node: Identifier): void;
    bigIntLiteral?(node: BigIntLiteral): void;
    numericLiteral?(node: NumericLiteral): void;
    computedPropName?(node: ComputedPropName): void;

    ifStatement?(node: IfStatement): void;
    tryStatement?(node: TryStatement): void;
    forStatement?(node: ForStatement): void;
    withStatement?(node: WithStatement): void;
    stringLiteral?(node: StringLiteral): void;
    blockStatement?(node: BlockStatement): void;
    callExpression?(node: CallExpression): void;
    forInStatement?(node: ForInStatement): void;
    forOfStatement?(node: ForOfStatement): void;
    whileStatement?(node: WhileStatement): void;
    switchStatement?(node: SwitchStatement): void;
    switchCase?(node: SwitchCase): void;
    classDeclaration?(node: ClassDeclaration): void;
    classMethod?(node: ClassMethod): void;
    privateMethod?(node: PrivateMethod): void;
    classProperty?(node: ClassProperty): void;
    privateProperty?(node: PrivateProperty): void;
    staticBlock?(node: StaticBlock): void;
    doWhileStatement?(node: DoWhileStatement): void;
    labeledStatement?(node: LabeledStatement): void;
    importDeclaration?(node: ImportDeclaration): void;
    exportDeclaration?(node: ExportDeclaration): void;
    functionDeclaration?(node: FunctionDeclaration): void;
    expressionStatement?(node: ExpressionStatement): void;
    exportAllDeclaration?(node: ExportAllDeclaration): void;
    exportNamedDeclaration?(node: ExportNamedDeclaration): void;
    returnStatement?(node: ReturnStatement): void;
    variableDeclaration?(node: VariableDeclaration): void;
    variableDeclarator?(node: VariableDeclarator): void;
    conditionalExpression?(node: ConditionalExpression): void;
    arrowFunctionExpression?(node: ArrowFunctionExpression): void;
    awaitExpression?(node: AwaitExpression): void;
    assignmentExpression?(node: AssignmentExpression): void;
    binaryExpression?(node: BinaryExpression): void;
    unaryExpression?(node: UnaryExpression): void;
    updateExpression?(node: UpdateExpression): void;
    sequenceExpression?(node: SequenceExpression): void;
    memberExpression?(node: MemberExpression): void;
    optionalChainingExpression?(node: OptionalChainingExpression): void;
    newExpression?(node: NewExpression): void;
    functionExpression?(node: FunctionExpression): void;
    classExpression?(node: ClassExpression): void;
    templateLiteral?(node: TemplateLiteral): void;
    taggedTemplateExpression?(node: TaggedTemplateExpression): void;
    yieldExpression?(node: YieldExpression): void;
    parenthesisExpression?(node: ParenthesisExpression): void;
    arrayExpression?(node: ArrayExpression): void;
    objectExpression?(node: ObjectExpression): void;
    throwStatement?(node: ThrowStatement): void;
    exportDefaultDeclaration?(node: ExportDefaultDeclaration): void;
    exportDefaultExpression?(node: ExportDefaultExpression): void;
    arrayPattern?(node: ArrayPattern): void;
    objectPattern?(node: ObjectPattern): void;
    assignmentPattern?(node: AssignmentPattern): void;
    restElement?(node: RestElement): void;
    spreadElement?(node: SpreadElement): void;
    keyValueProperty?(node: KeyValueProperty): void;
    assignmentProperty?(node: AssignmentProperty): void;
    getterProperty?(node: GetterProperty): void;
    setterProperty?(node: SetterProperty): void;
    methodProperty?(node: MethodProperty): void;
    keyValuePatternProperty?(node: KeyValuePatternProperty): void;
    assignmentPatternProperty?(node: AssignmentPatternProperty): void;
}