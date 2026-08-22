import { DrawingObject } from './DrawingObject'
import { DrawingType } from './DrawingType'
import type { DrawingAnchor } from '../models/DrawingAnchor'

export abstract class PositionDrawing extends DrawingObject {
    public profitColor = '#26a69a44'
    public lossColor = '#ef535044'
    public lineColor = '#aaa'

    constructor(
        id: string,
        type: DrawingType,
        public start: DrawingAnchor,
        public end: DrawingAnchor,
        public target: DrawingAnchor,
        public stoploss: DrawingAnchor,
    ) {
        super(id, type)
    }
}
