import type { Drawing } from './Drawing'
import type { DrawingType } from '../DrawingType'

export abstract class DrawingObject implements Drawing {
    public locked = false

    public visible = true

    constructor(public readonly id: string, public readonly type: DrawingType) {}

    public abstract clone(): Drawing

    public destroy(): void {}
}
