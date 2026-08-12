import { TrendLineDrawing } from '../drawings/TrendLineDrawing'

import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../drawings/DrawingType'
import type { DrawingRenderer } from './DrawingRenderer'
import type { DrawingRenderState } from './DrawingrendererState'
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

        const hovered = state.hovered === drawing
        const selected = state.selected === drawing

        if (!start || !end) return

        DrawingPrimitives.line(ctx, start, end, drawing.color, drawing.width, drawing.style)

        if (hovered || selected) {
            DrawingHandles.circle(ctx, start, selected)
            DrawingHandles.circle(ctx, end, selected)
        }
    }

    public destroy(_drawing: TrendLineDrawing) {}
}
