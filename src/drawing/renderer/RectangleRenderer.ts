import type { RectangleDrawing } from '../drawings/RectangleDrawing'

import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../drawings/DrawingType'
import type { DrawingRenderer } from './DrawingRenderer'
import type { DrawingRenderState } from './DrawingrendererState'
import type { CoordinateTransformer } from './CoordinateTransformer'

import { DrawingPrimitives } from './DrawingPrimitives'
import { DrawingHandles, HandleType } from './DrawingHandles'

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
                state.selected === drawing,
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
        selected: boolean = false,
    ) {
        const { left, top, right, bottom } = rect

        const handles = [
            { x: (left + right) / 2, y: top, type: HandleType.SQUARE },
            { x: (left + right) / 2, y: bottom, type: HandleType.SQUARE },

            { x: left, y: top, type: HandleType.CIRCLE },
            { x: left, y: bottom, type: HandleType.CIRCLE },
            { x: left, y: (top + bottom) / 2, type: HandleType.SQUARE },

            { x: right, y: top, type: HandleType.CIRCLE },
            { x: right, y: (top + bottom) / 2, type: HandleType.SQUARE },
            { x: right, y: bottom, type: HandleType.CIRCLE },
        ]

        for (const handle of handles) {
            switch (handle.type) {
                case HandleType.CIRCLE:
                    DrawingHandles.circle(ctx, handle, selected)
                    break

                case HandleType.SQUARE:
                    DrawingHandles.square(ctx, handle, selected)
                    break
            }
        }
    }

    public destroy(_drawing: RectangleDrawing) {}
}
