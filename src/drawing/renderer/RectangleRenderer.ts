import type { Drawing } from '../drawings/Drawing'
import type { RectangleDrawing } from '../drawings/RectangleDrawing'

import type { CoordinateTransformer } from './CoordinateTransformer'
import type { DrawingRenderer } from './DrawingRenderer'

import { DrawingPrimitives } from './DrawingPrimitives'
import { DrawingType } from '../drawings/DrawingType'
import type { DrawingRenderState } from './DrawingrendererState'

export class RectangleRenderer implements DrawingRenderer<RectangleDrawing> {
    public canRender(drawing: Drawing): drawing is RectangleDrawing {
        return drawing.type === DrawingType.Rectangle
    }

    public render(
        drawing: RectangleDrawing,
        ctx: CanvasRenderingContext2D,
        transformer: CoordinateTransformer,
        state: DrawingRenderState,
    ) {
        const start = transformer.toPoint(drawing.start)
        const end = transformer.toPoint(drawing.end)

        if (!start || !end) {
            return
        }

        const x = Math.min(start.x, end.x)
        const y = Math.min(start.y, end.y)
        const width = Math.abs(end.x - start.x)
        const height = Math.abs(end.y - start.y)

        DrawingPrimitives.rectangle(
            ctx,
            x,
            y,
            width,
            height,
            drawing.color,
            drawing.width,
            drawing.style,
            drawing.backgropund,
        )

        if (state.hovered === drawing || state.selected === drawing) {
            DrawingPrimitives.circle(
                ctx,
                {
                    x: end.x,
                    y: end.y,
                },
                5,
                '#fff',
                drawing.color,
            )
        }
    }

    public destroy(_drawing: RectangleDrawing) {}
}
