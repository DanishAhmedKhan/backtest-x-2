import { DrawingObject } from './DrawingObject'

import type { ChartPoint } from '../models/ChartPoint'
import type { DrawingType } from '../DrawingType'

export abstract class LineDrawing extends DrawingObject {
    public color = '#2962FF'

    public width = 2

    constructor(id: string, type: DrawingType, public start: ChartPoint, public end: ChartPoint) {
        super(id, type)
    }
}
