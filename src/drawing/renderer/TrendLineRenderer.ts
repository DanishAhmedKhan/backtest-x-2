import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../DrawingType'
import { TrendLineDrawing } from '../drawings/TrendLineDrawing'
import type { DrawingRenderer } from './DrawingRenderer'
import { CoordinateTransformer } from './CoordinateTransformer'
import type { DrawingRenderState } from './DrawingrendererState'

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

        ctx.beginPath()

        ctx.moveTo(start.x, start.y)

        ctx.lineTo(end.x, end.y)

        ctx.strokeStyle = hovered || selected ? '#42A5F5' : '#2196F3'

        ctx.lineWidth = hovered || selected ? 3 : 2

        ctx.stroke()

        if (hovered || selected) {
            this.drawHandle(ctx, start.x, start.y)

            this.drawHandle(ctx, end.x, end.y)
        }
    }

    private drawHandle(ctx: CanvasRenderingContext2D, x: number, y: number) {
        ctx.beginPath()

        ctx.arc(x, y, 5, 0, Math.PI * 2)

        ctx.fillStyle = '#2196F3'

        ctx.fill()

        ctx.strokeStyle = '#ffffff'

        ctx.lineWidth = 2

        ctx.stroke()
    }

    public destroy(drawing: TrendLineDrawing) {
        console.info(drawing)
    }
}
