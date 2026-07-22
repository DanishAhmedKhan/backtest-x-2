import type { Drawing } from '../drawings/Drawing'
import { TrendLineDrawing } from '../drawings/TrendLineDrawing'
import { DrawingType } from '../DrawingType'
import { CoordinateTransformer } from './CoordinateTransformer'
import type { DrawingRenderer } from './DrawingRenderer'

export class TrendLineRenderer implements DrawingRenderer<TrendLineDrawing> {
    public canRender(drawing: Drawing): drawing is TrendLineDrawing {
        return drawing.type === DrawingType.TrendLine
    }

    public render(drawing: TrendLineDrawing, ctx: CanvasRenderingContext2D, transformer: CoordinateTransformer) {
        const start = transformer.toPoint(drawing.start.time, drawing.start.price)

        const end = transformer.toPoint(drawing.end.time, drawing.end.price)

        if (!start || !end) {
            return
        }

        ctx.beginPath()

        ctx.moveTo(start.x, start.y)

        ctx.lineTo(end.x, end.y)

        ctx.strokeStyle = '#2196F3'
        ctx.lineWidth = 2

        ctx.stroke()
    }

    public destroy(_drawing: TrendLineDrawing) {}
}
