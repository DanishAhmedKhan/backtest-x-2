import type { Drawing } from './Drawing'
import type { DrawingType } from '../DrawingType'

export abstract class DrawingObject implements Drawing {
    constructor(public readonly id: string, public readonly type: DrawingType) {}

    public destroy(): void {}
}
