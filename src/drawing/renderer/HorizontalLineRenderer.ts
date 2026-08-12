import { HorizontalLineDrawing } from '../drawings/HorizontalLineDrawing'

import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../drawings/DrawingType'
import type { DrawingRenderState } from './DrawingrendererState'
import type { DrawingRenderer } from './DrawingRenderer'
import type { CoordinateTransformer } from './CoordinateTransformer'

import { DrawingPrimitives } from './DrawingPrimitives'
import { DrawingHandles } from './DrawingHandles'

export class HorizontalLineRenderer implements DrawingRenderer<HorizontalLineDrawing> {
    public canRender(drawing: Drawing): drawing is HorizontalLineDrawing {
        return drawing.type === DrawingType.HorizontalLine
    }

    public render(
        drawing: HorizontalLineDrawing,
        ctx: CanvasRenderingContext2D,
        transformer: CoordinateTransformer,
        state: DrawingRenderState,
    ) {
        const anchor = transformer.toPoint(drawing.anchor)

        if (!anchor) return

        const width = ctx.canvas.clientWidth

        DrawingPrimitives.line(
            ctx,
            { x: 0, y: anchor.y },
            { x: width, y: anchor.y },
            drawing.color,
            drawing.width,
            drawing.style,
        )

        if (state.hovered === drawing || state.selected === drawing) {
            const handle = {
                x: width - 100,
                y: anchor.y,
            }
            DrawingHandles.square(ctx, handle, state.selected === drawing)
        }
    }

    public destroy(_drawing: HorizontalLineDrawing) {}
}
