import { TrendLineDrawing } from '../drawings/TrendLineDrawing'

import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../drawings/DrawingType'
import type { DrawingRenderer } from './DrawingRenderer'
import type { DrawingRenderState } from './DrawingRenderState'
import { CoordinateTransformer } from './CoordinateTransformer'

import { DrawingPrimitives } from './DrawingPrimitives'
import { DrawingHandles } from './DrawingHandles'

export class TrendLineRenderer implements DrawingRenderer<TrendLineDrawing> {
    public canRender(drawing: Drawing): drawing is TrendLineDrawing {
        return drawing.type === DrawingType.TrendLine
    }

    public render(
        drawing: TrendLineDrawing,
        ctx: CanvasRenderingContext2D,
        transformer: CoordinateTransformer,
        state: DrawingRenderState,
    ) {
        const start = transformer.toPoint(drawing.start)
        const end = transformer.toPoint(drawing.end)

        if (!start || !end) return

        DrawingPrimitives.drawLine(ctx, start, end, drawing.color, drawing.width, drawing.style)

        if (state.active) {
            DrawingHandles.circle(ctx, start, state.selected)
            DrawingHandles.circle(ctx, end, state.selected)
        }
    }

    public destroy(_drawing: TrendLineDrawing) {}
}
