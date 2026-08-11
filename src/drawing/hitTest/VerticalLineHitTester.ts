import type { VerticalLineDrawing } from '../drawings/VerticalLineDrawing'

import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../drawings/DrawingType'
import type { DrawingHitTester } from './DrawingHitTester'
import type { DrawingAnchor } from '../models/DrawingAnchor'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'
import { HitTestConstants } from './HitTestConstant'
import { HitTarget } from './HitTestResult'
import { CursorType } from '../../core/cursor/CursorType'

export class VerticalLineHitTester implements DrawingHitTester<VerticalLineDrawing> {
    public canHitTest(drawing: Drawing): drawing is VerticalLineDrawing {
        return drawing.type === DrawingType.VerticalLine
    }

    public hitTest(
        drawing: VerticalLineDrawing,
        point: DrawingAnchor,
        transformer: CoordinateTransformer,
        tolerance = HitTestConstants.HOVER_LINE_TOLERANCE,
    ) {
        const line = transformer.toPoint(drawing.anchor)
        const mouse = transformer.toPoint(point)

        if (!line || !mouse) {
            return null
        }

        if (Math.abs(mouse.x - line.x) <= tolerance) {
            return {
                drawing,
                target: HitTarget.Body,
                cursor: CursorType.Move,
            }
        }

        return null
    }
}
