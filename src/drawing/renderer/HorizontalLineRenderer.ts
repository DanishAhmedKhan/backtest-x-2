import type { Drawing } from '../drawings/Drawing'
import { HorizontalLineDrawing } from '../drawings/HorizontalLineDrawing'

import type { CoordinateTransformer } from './CoordinateTransformer'
import type { DrawingRenderer } from './DrawingRenderer'

import { DrawingPrimitives } from './DrawingPrimitives'
import { DrawingType } from '../DrawingType'
import type { DrawingRenderState } from './DrawingrendererState'

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

        if (!anchor) {
            return
        }

        DrawingPrimitives.line(
            ctx,
            { x: 0, y: anchor.y },
            { x: ctx.canvas.width, y: anchor.y },
            drawing.color,
            drawing.width,
        )

        if (state.hovered === drawing || state.selected === drawing) {
            const handle = {
                x: ctx.canvas.width - 12,
                y: anchor.y,
            }
            DrawingPrimitives.circle(ctx, handle, 5, '#fff', drawing.color)
        }
    }

    public destroy(_drawing: HorizontalLineDrawing) {}
}
