import type { LongPositionDrawing } from '../drawings/LongPositionDrawing'

import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../drawings/DrawingType'
import type { DrawingRenderState } from './DrawingRenderState'
import type { DrawingRenderer } from './DrawingRenderer'
import type { CoordinateTransformer } from './CoordinateTransformer'

import { DrawingPositions } from './DawingPositions'
import { DrawingHandles } from './DrawingHandles'

export class LongPositionRenderer implements DrawingRenderer<LongPositionDrawing> {
    public canRender(drawing: Drawing): drawing is LongPositionDrawing {
        return drawing.type === DrawingType.LongPosition
    }

    public render(
        drawing: LongPositionDrawing,
        ctx: CanvasRenderingContext2D,
        transformer: CoordinateTransformer,
        state: DrawingRenderState,
    ) {
        const start = transformer.toPoint(drawing.start)
        const end = transformer.toPoint(drawing.end)
        const top = transformer.toPoint(drawing.top)
        const bottom = transformer.toPoint(drawing.bottom)

        if (!start || !end || !top || !bottom) {
            return
        }

        const left = Math.min(start.x, end.x)
        const right = Math.max(start.x, end.x)

        const entryY = start.y
        const profitTopY = Math.min(top.y, entryY)
        const lossBottomY = Math.max(bottom.y, entryY)

        DrawingPositions.long(
            ctx,
            left,
            right,
            entryY,
            profitTopY,
            lossBottomY,
            drawing.profitColor,
            drawing.lossColor,
            drawing.lineColor,
            1,
        )

        if (state.selected || state.hovered) {
            DrawingHandles.circle(ctx, start, state.selected)
            DrawingHandles.square(ctx, end, state.selected)
            DrawingHandles.square(ctx, top, state.selected)
            DrawingHandles.square(ctx, bottom, state.selected)
        }
    }

    public destroy(_drawing: LongPositionDrawing) {}
}
