import { DrawingType } from '../DrawingType'
import { DrawingObject } from './DrawingObject'
import type { ChartPoint } from '../models/ChartPoint'

export class TrendLineDrawing extends DrawingObject {
    constructor(id: string, public start: ChartPoint, public end: ChartPoint) {
        super(id, DrawingType.TrendLine)
    }

    public clone(): TrendLineDrawing {
        return new TrendLineDrawing(this.id, { ...this.start }, { ...this.end })
    }
}
