import type { Drawing } from '../drawings/Drawing'
import { TrendLineDrawing } from '../drawings/TrendLineDrawing'

import type { DrawingRenderer } from './DrawingRenderer'

export class TrendLineRenderer implements DrawingRenderer<TrendLineDrawing> {
    public canRender(drawing: Drawing): drawing is TrendLineDrawing {
        return drawing.constructor === TrendLineDrawing
    }

    public render(drawing: TrendLineDrawing, ctx: CanvasRenderingContext2D, transformer: CoordinateTransformer) {
        const start = transformer.toPoint(drawing.startTime, drawing.startPrice)

        const end = transformer.toPoint(drawing.endTime, drawing.endPrice)

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

    public destroy(drawing: TrendLineDrawing): void {
        console.log('Destroy trend line', drawing.id)
    }
}
