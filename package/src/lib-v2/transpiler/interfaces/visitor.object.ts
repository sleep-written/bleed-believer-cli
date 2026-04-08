import type { Node } from 'typescript';

export interface VisitorObject<N extends Node = Node> {
    accept(node: N): boolean;
    visit(node: N): Node;
}