import type { RectangleDrawing } from '../drawings/RectangleDrawing'

import type { DrawingHitTester } from './DrawingHitTester'
import { HitTarget } from './HitTestResult'
import { HitTestConstants } from './HitTestConstant'

import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../drawings/DrawingType'
import type { DrawingAnchor } from '../models/DrawingAnchor'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'

import { CursorType } from '../../core/cursor/CursorType'

export class RectangleHitTester implements DrawingHitTester<RectangleDrawing> {
    public canHitTest(drawing: Drawing): drawing is RectangleDrawing {
        return drawing.type === DrawingType.Rectangle
    }

    public hitTest(
        drawing: RectangleDrawing,
        point: DrawingAnchor,
        transformer: CoordinateTransformer,
        tolerance = HitTestConstants.HOVER_LINE_TOLERANCE,
    ) {
        const start = transformer.toPoint(drawing.start)
        const end = transformer.toPoint(drawing.end)
        const mouse = transformer.toPoint(point)

        if (!start || !end || !mouse) {
            return null
        }

        const left = Math.min(start.x, end.x)
        const right = Math.max(start.x, end.x)
        const top = Math.min(start.y, end.y)
        const bottom = Math.max(start.y, end.y)

        const inside = mouse.x >= left && mouse.x <= right && mouse.y >= top && mouse.y <= bottom

        if (!inside) {
            return null
        }

        const nearLeft = Math.abs(mouse.x - left) <= tolerance
        const nearRight = Math.abs(mouse.x - right) <= tolerance
        const nearTop = Math.abs(mouse.y - top) <= tolerance
        const nearBottom = Math.abs(mouse.y - bottom) <= tolerance

        if (nearLeft || nearRight || nearTop || nearBottom) {
            return {
                drawing,
                target: HitTarget.Body,
                cursor: CursorType.Move,
            }
        }

        return {
            drawing,
            target: HitTarget.Body,
            cursor: CursorType.Move,
        }
    }
}
