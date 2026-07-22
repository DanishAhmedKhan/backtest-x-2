import type { Drawing } from './Drawing'
import { DrawingType } from '../DrawingType'
import type { ChartPoint } from '../models/ChartPoint'

export class TrendLineDrawing implements Drawing {
    public readonly id = crypto.randomUUID()

    public readonly type = DrawingType.TrendLine

    constructor(public start: ChartPoint, public end: ChartPoint) {}

    public destroy() {}
}
