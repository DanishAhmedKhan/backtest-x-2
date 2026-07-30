import { LineDrawing } from './LineDrawing'
import type { DrawingAnchor } from '../models/DrawingAnchor'
import { DrawingType } from '../DrawingType'

export class TrendLineDrawing extends LineDrawing {
    constructor(id: string, start: DrawingAnchor, end: DrawingAnchor) {
        super(id, DrawingType.TrendLine, start, end)
    }

    public clone() {
        const clone = new TrendLineDrawing(this.id, { ...this.start }, { ...this.end })

        clone.color = this.color
        clone.width = this.width

        return clone
    }
}
