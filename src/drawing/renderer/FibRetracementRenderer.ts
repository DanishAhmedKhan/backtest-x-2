import { FibRetracementDrawing } from '../drawings/FibRetracementDrawing'

import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../drawings/DrawingType'
import type { DrawingRenderer } from './DrawingRenderer'
import type { DrawingRenderState } from './DrawingRenderState'
import { CoordinateTransformer } from './CoordinateTransformer'

import { DrawingPrimitives } from './DrawingPrimitives'
import { DrawingHandles } from './DrawingHandles'

export class FibRetracementRenderer implements DrawingRenderer<FibRetracementDrawing> {
    public canRender(drawing: Drawing): drawing is FibRetracementDrawing {
        return drawing.type === DrawingType.FibRetracement
    }

    public render(
        drawing: FibRetracementDrawing,
        ctx: CanvasRenderingContext2D,
        transformer: CoordinateTransformer,
        state: DrawingRenderState,
    ) {
        const start = transformer.toPoint(drawing.start)
        const end = transformer.toPoint(drawing.end)

        if (!start || !end) return

        for (const level of FibRetracementDrawing.LEVELS) {
            const price = drawing.getPriceAtLevel(level)

            const levelStart = transformer.toPoint({
                time: drawing.start.time,
                price,
            })

            const levelEnd = transformer.toPoint({
                time: drawing.end.time,
                price,
            })

            if (!levelStart || !levelEnd) continue

            DrawingPrimitives.drawLine(ctx, levelStart, levelEnd, drawing.color, drawing.width, drawing.style)
            DrawingPrimitives.drawText(
                ctx,
                String(level),
                Math.min(levelStart.x, levelEnd.x) - 8,
                levelStart.y,
                drawing.color,
            )
        }

        if (state.active) {
            DrawingHandles.circle(ctx, start, state.selected)
            DrawingHandles.circle(ctx, end, state.selected)
        }
    }

    public destroy(_drawing: FibRetracementDrawing) {}
}
