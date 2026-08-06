import { CursorType } from '../../core/cursor/CursorType'
import type { Drawing } from '../drawings/Drawing'
import type { HorizontalLineDrawing } from '../drawings/HorizontalLineDrawing'
import { DrawingType } from '../DrawingType'
import type { DrawingAnchor } from '../models/DrawingAnchor'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'
import type { DrawingHitTester } from './DrawingHitTester'
import { HitTestConstants } from './HitTestConstant'
import { HitTarget } from './HitTestResult'

export class HorizontalLineHitTester implements DrawingHitTester<HorizontalLineDrawing> {
    public canHitTest(drawing: Drawing): drawing is HorizontalLineDrawing {
        return drawing.type === DrawingType.HorizontalLine
    }

    public hitTest(
        drawing: HorizontalLineDrawing,
        point: DrawingAnchor,
        transformer: CoordinateTransformer,
        tolerance = HitTestConstants.HOVER_LINE_TOLERANCE,
    ) {
        const line = transformer.toPoint(drawing.anchor)
        const mouse = transformer.toPoint(point)

        if (!line || !mouse) {
            return null
        }

        if (Math.abs(mouse.y - line.y) <= tolerance) {
            return {
                drawing,
                target: HitTarget.Body,
                cursor: CursorType.Move,
            }
        }

        return null
    }
}
