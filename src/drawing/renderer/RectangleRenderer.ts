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

        const left = Math.min(start.x, end.x)
        const right = Math.max(start.x, end.x)
        const top = Math.min(start.y, end.y)
        const bottom = Math.max(start.y, end.y)

        const width = right - left
        const height = bottom - top

        DrawingPrimitives.rectangle(
            ctx,
            left,
            top,
            width,
            height,
            drawing.color,
            drawing.width,
            drawing.style,
            drawing.background,
        )

        if (state.hovered === drawing || state.selected === drawing) {
            this.renderHandles(
                ctx,
                {
                    left,
                    top,
                    right,
                    bottom,
                },
                drawing.color,
            )
        }
    }

    private renderHandles(
        ctx: CanvasRenderingContext2D,
        rect: {
            left: number
            top: number
            right: number
            bottom: number
        },
        color: string,
    ) {
        const { left, top, right, bottom } = rect

        const handles = [
            { x: left, y: top },
            { x: (left + right) / 2, y: top },
            { x: right, y: top },

            { x: right, y: (top + bottom) / 2 },

            { x: right, y: bottom },
            { x: (left + right) / 2, y: bottom },
            { x: left, y: bottom },

            { x: left, y: (top + bottom) / 2 },
        ]

        for (const handle of handles) {
            DrawingPrimitives.square(ctx, handle, 6, '#fff', color)
        }
    }

    public destroy(_drawing: RectangleDrawing) {}
}
