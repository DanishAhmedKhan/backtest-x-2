import type { DrawingAnchor } from '../models/DrawingAnchor'
import { CoordinateTransformer, type ScreenPoint } from '../renderer/CoordinateTransformer'

export class TrendLineSnapper {
    constructor(private readonly transformer: CoordinateTransformer) {}

    public snap(
        start: DrawingAnchor,
        pointerAnchor: DrawingAnchor,
        screen: ScreenPoint,
        shiftKey: boolean,
    ): DrawingAnchor {
        if (!shiftKey) {
            return pointerAnchor
        }

        const startPoint = this.transformer.toPoint(start)

        if (!startPoint) {
            return pointerAnchor
        }

        const dx = screen.x - startPoint.x
        const dy = screen.y - startPoint.y

        if (dx === 0 && dy === 0) {
            return pointerAnchor
        }

        const angle = Math.atan2(dy, dx)

        const snapStep = Math.PI / 4
        const snappedAngle = Math.round(angle / snapStep) * snapStep

        const distance = Math.hypot(dx, dy)

        const snappedPoint: ScreenPoint = {
            x: startPoint.x + Math.cos(snappedAngle) * distance,
            y: startPoint.y + Math.sin(snappedAngle) * distance,
        }

        return this.transformer.toAnchor(snappedPoint.x, snappedPoint.y) ?? pointerAnchor
    }
}
