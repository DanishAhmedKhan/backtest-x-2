import type { Drawing } from '../drawings/Drawing'
import type { VerticalLineDrawing } from '../drawings/VerticalLineDrawing'

import type { CoordinateTransformer } from './CoordinateTransformer'
import type { DrawingRenderer } from './DrawingRenderer'

import { DrawingPrimitives } from './DrawingPrimitives'
import { DrawingType } from '../drawings/DrawingType'
import type { DrawingRenderState } from './DrawingrendererState'

export class VerticalLineRenderer implements DrawingRenderer<VerticalLineDrawing> {
    public canRender(drawing: Drawing): drawing is VerticalLineDrawing {
        return drawing.type === DrawingType.VerticalLine
    }

    public render(
        drawing: VerticalLineDrawing,
        ctx: CanvasRenderingContext2D,
        transformer: CoordinateTransformer,
        state: DrawingRenderState,
    ) {
        const anchor = transformer.toPoint(drawing.anchor)

        if (!anchor) return

        const height = ctx.canvas.clientHeight

        DrawingPrimitives.line(
            ctx,
            { x: anchor.x, y: 0 },
            { x: anchor.x, y: height },
            drawing.color,
            drawing.width,
            drawing.style,
        )

        if (state.hovered === drawing || state.selected === drawing) {
            const handle = {
                x: anchor.x,
                y: height - 100,
            }

            DrawingPrimitives.circle(ctx, handle, 5, '#fff', drawing.color)
        }
    }

    public destroy(_drawing: VerticalLineDrawing) {}
}
