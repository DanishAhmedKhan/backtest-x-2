import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { DrawingAnchor } from '../models/DrawingAnchor'
import { CoordinateTransformer, type ScreenPoint } from '../renderer/CoordinateTransformer'

export class TrendLineSnapper {
    constructor(private readonly transformer: CoordinateTransformer) {}

    public snap(start: DrawingAnchor, event: ChartPointerEvent): DrawingAnchor {
        if (!event.shiftKey) {
            return event.anchor
        }

        const startPoint = this.transformer.toPoint(start, true)

        if (!startPoint) {
            return event.anchor
        }

        const currentPoint = event.screen

        const dx = currentPoint.x - startPoint.x
        const dy = currentPoint.y - startPoint.y

        if (dx === 0 && dy === 0) {
            return event.anchor
        }

        const angle = Math.atan2(dy, dx)

        const snapStep = Math.PI / 4
        const snappedAngle = Math.round(angle / snapStep) * snapStep

        const distance = Math.hypot(dx, dy)

        const snappedPoint: ScreenPoint = {
            x: startPoint.x + Math.cos(snappedAngle) * distance,
            y: startPoint.y + Math.sin(snappedAngle) * distance,
        }

        return this.transformer.toAnchor(snappedPoint.x, snappedPoint.y) ?? event.anchor
    }
}
