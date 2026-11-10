import { LineDrawing } from './LineDrawing'
import type { DrawingAnchor } from '../models/DrawingAnchor'
import { DrawingType } from './DrawingType'

export class FibRetracementDrawing extends LineDrawing {
    public static readonly LEVELS = [0, 1, 0.5, -1, -2, -4] as const
    public width = 1

    constructor(id: string, start: DrawingAnchor, end: DrawingAnchor) {
        super(id, DrawingType.FibRetracement, start, end)
    }

    public getPriceAtLevel(level: number): number {
        return this.end.price + (this.start.price - this.end.price) * level
    }

    public clone() {
        const clone = new FibRetracementDrawing(this.id, { ...this.start }, { ...this.end })

        clone.color = this.color
        clone.style = this.style
        clone.width = this.width

        return clone
    }
}
