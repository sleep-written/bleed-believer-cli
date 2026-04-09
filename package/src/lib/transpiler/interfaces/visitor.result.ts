import type { Node } from 'typescript';

export interface VisitorResult {
    node: Node;
    shortCircuit: boolean;
}