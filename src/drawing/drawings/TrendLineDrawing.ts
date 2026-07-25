import { DrawingType } from '../DrawingType'
import type { ChartPoint } from '../models/ChartPoint'
import { DrawingObject } from './DrawingObject'

export class TrendLineDrawing extends DrawingObject {
    constructor(id: string, public start: ChartPoint, public end: ChartPoint) {
        super(id, DrawingType.TrendLine)
    }
}
