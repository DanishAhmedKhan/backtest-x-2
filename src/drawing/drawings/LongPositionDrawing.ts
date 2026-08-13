import { PositionDirection, PositionDrawing } from './PositionDrawing'
import { DrawingType } from './DrawingType'
import type { DrawingAnchor } from '../models/DrawingAnchor'

export class LongPositionDrawing extends PositionDrawing {
    constructor(
        id: string,
        public start: DrawingAnchor,
        public end: DrawingAnchor,
        public top: DrawingAnchor,
        public bottom: DrawingAnchor,
        public direction = PositionDirection.Long,
    ) {
        super(id, DrawingType.LongPosition, start, end, top, bottom, PositionDirection.Long)
    }

    public clone(): PositionDrawing {
        const clone = new LongPositionDrawing(
            this.id,
            { ...this.start },
            { ...this.end },
            { ...this.top },
            { ...this.bottom },
            this.direction,
        )

        clone.profitColor = this.profitColor
        clone.lossColor = this.lossColor
        clone.lineColor = this.lineColor

        return clone
    }
}
