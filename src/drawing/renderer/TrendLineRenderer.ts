import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../DrawingType'
import { TrendLineDrawing } from '../drawings/TrendLineDrawing'
import type { DrawingRenderer } from './DrawingRenderer'
import { CoordinateTransformer } from './CoordinateTransformer'
import type { DrawingRenderState } from './DrawingrendererState'
import { DrawingPrimitives } from './DrawingPrimitives'

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
        const start = transformer.toPoint(drawing.start.time, drawing.start.price)
        const end = transformer.toPoint(drawing.end.time, drawing.end.price)

        const hovered = state.hovered === drawing
        const selected = state.selected === drawing

        if (!start || !end) return

        DrawingPrimitives.line(ctx, start, end, drawing.color, drawing.width)

        if (hovered || selected) {
            DrawingPrimitives.circle(ctx, start, 5, '#fff', drawing.color)

            DrawingPrimitives.circle(ctx, end, 5, '#fff', drawing.color)
        }
    }

    public destroy(drawing: TrendLineDrawing) {
        console.info(drawing)
    }
}
