import type { VisitorResult } from './visitor.result.ts';
import type { Node } from 'typescript';

export type VisitorFunction = (node: Node) => (
    Node |
    undefined |
    VisitorResult
);