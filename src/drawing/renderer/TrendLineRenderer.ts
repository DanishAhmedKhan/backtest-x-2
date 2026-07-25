import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../DrawingType'
import { TrendLineDrawing } from '../drawings/TrendLineDrawing'
import type { DrawingRenderer } from './DrawingRenderer'
import type { DrawingStateManager } from '../managers/DrawingStateManager'
import { CoordinateTransformer } from './CoordinateTransformer'

export class TrendLineRenderer implements DrawingRenderer<TrendLineDrawing> {
    public canRender(drawing: Drawing): drawing is TrendLineDrawing {
        return drawing.type === DrawingType.TrendLine
    }

    public render(
        drawing: TrendLineDrawing,
        ctx: CanvasRenderingContext2D,
        transformer: CoordinateTransformer,
        drawingStateManager: DrawingStateManager,
    ) {
        const start = transformer.toPoint(drawing.start.time, drawing.start.price)
        const end = transformer.toPoint(drawing.end.time, drawing.end.price)

        if (!start || !end) return

        ctx.beginPath()

        ctx.moveTo(start.x, start.y)

        ctx.lineTo(end.x, end.y)

        ctx.strokeStyle = '#2196F3'
        ctx.lineWidth = 2

        ctx.stroke()

        if (!drawingStateManager.isSelected(drawing)) {
            return
        }

        ctx.fillStyle = '#2962ff'

        ctx.beginPath()
        ctx.arc(start.x, start.y, 5, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.arc(end.x, end.y, 5, 0, Math.PI * 2)
        ctx.fill()
    }

    public destroy(drawing: TrendLineDrawing) {
        console.info(drawing)
    }
}
