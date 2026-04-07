import type { VisitorContext } from './visitor.context.ts';
import type { Node } from 'typescript';

export interface VisitorObject {
    accept(node: Node): boolean;
    visit(node: Node, context: VisitorContext): Node | undefined;
}