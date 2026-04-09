import type { VisitorFunction } from './visitor.function.ts';

export interface TranspilerPlugin {
    visitors: readonly VisitorFunction[];
}