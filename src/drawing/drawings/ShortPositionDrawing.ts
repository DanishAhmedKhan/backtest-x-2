import { PositionDirection, PositionDrawing } from './PositionDrawing'
import { DrawingType } from './DrawingType'
import type { DrawingAnchor } from '../models/DrawingAnchor'

export class ShortPositionDrawing extends PositionDrawing {
    constructor(
        id: string,
        public start: DrawingAnchor,
        public end: DrawingAnchor,
        public target: DrawingAnchor,
        public stoploss: DrawingAnchor,
        public direction = PositionDirection.Short,
    ) {
        super(id, DrawingType.ShortPosition, start, end, target, stoploss, PositionDirection.Long)
    }

    public clone(): PositionDrawing {
        const clone = new ShortPositionDrawing(
            this.id,
            { ...this.start },
            { ...this.end },
            { ...this.target },
            { ...this.stoploss },
            this.direction,
        )

        clone.profitColor = this.profitColor
        clone.lossColor = this.lossColor
        clone.lineColor = this.lineColor

        return clone
    }
}
