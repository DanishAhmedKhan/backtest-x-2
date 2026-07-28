import { DrawingType } from '../DrawingType'
import { DrawingObject } from './DrawingObject'
import type { ChartPoint } from '../models/ChartPoint'

export class TrendLineDrawing extends DrawingObject {
    public color = '#2196F3'

    public width = 2

    constructor(id: string, public start: ChartPoint, public end: ChartPoint) {
        super(id, DrawingType.TrendLine)
    }

    public clone(): TrendLineDrawing {
        const clone = new TrendLineDrawing(this.id, { ...this.start }, { ...this.end })

        clone.color = this.color
        clone.width = this.width
        clone.locked = this.locked
        clone.visible = this.visible

        return clone
    }
}
