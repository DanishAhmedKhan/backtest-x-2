import { DrawingType } from '../DrawingType'
import type { ChartPoint } from '../models/ChartPoint'
import { LineDrawing } from './LineDrawing'

export class TrendLineDrawing extends LineDrawing {
    constructor(id: string, start: ChartPoint, end: ChartPoint) {
        super(id, DrawingType.TrendLine, start, end)
    }

    public clone() {
        const clone = new TrendLineDrawing(this.id, { ...this.start }, { ...this.end })

        clone.color = this.color
        clone.width = this.width

        return clone
    }
}
