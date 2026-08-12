import type { VerticalLineDrawing } from '../drawings/VerticalLineDrawing'

import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../drawings/DrawingType'
import type { DrawingRenderState } from './DrawingrendererState'
import type { DrawingRenderer } from './DrawingRenderer'
import type { CoordinateTransformer } from './CoordinateTransformer'

import { DrawingPrimitives } from './DrawingPrimitives'
import { DrawingHandles } from './DrawingHandles'

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
            DrawingHandles.square(ctx, handle, state.selected === drawing)
        }
    }

    public destroy(_drawing: VerticalLineDrawing) {}
}
