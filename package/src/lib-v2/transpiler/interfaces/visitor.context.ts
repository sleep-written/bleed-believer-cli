import type { TsconfigObject } from './tsconfig.object.ts';

export interface VisitorContext {
    filename: string;
    tsconfig: TsconfigObject;
}