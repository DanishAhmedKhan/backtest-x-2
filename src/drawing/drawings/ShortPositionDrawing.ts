import { PositionDrawing } from './PositionDrawing'
import { DrawingType } from './DrawingType'
import type { DrawingAnchor } from '../models/DrawingAnchor'

export class ShortPositionDrawing extends PositionDrawing {
    constructor(
        id: string,
        public start: DrawingAnchor,
        public end: DrawingAnchor,
        public target: DrawingAnchor,
        public stoploss: DrawingAnchor,
    ) {
        super(id, DrawingType.ShortPosition, start, end, target, stoploss)
    }

    public clone(): PositionDrawing {
        const clone = new ShortPositionDrawing(
            this.id,
            { ...this.start },
            { ...this.end },
            { ...this.target },
            { ...this.stoploss },
        )

        clone.profitColor = this.profitColor
        clone.lossColor = this.lossColor
        clone.lineColor = this.lineColor

        return clone
    }
}
