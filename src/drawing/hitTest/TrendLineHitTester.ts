import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../DrawingType'
import { TrendLineDrawing } from '../drawings/TrendLineDrawing'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'
import type { DrawingHitTester } from './DrawingHitTester'
import { HitTarget } from './HitTestResult'
import { HitTestConstants } from './HitTestConstant'
import { CursorType } from '../CursorType'
import { LineGeometry } from '../geometry/LineGeometry'
import type { DrawingAnchor } from '../models/DrawingAnchor'

export class TrendLineHitTester implements DrawingHitTester<TrendLineDrawing> {
    public canHitTest(drawing: Drawing): drawing is TrendLineDrawing {
        return drawing.type === DrawingType.TrendLine
    }

    public hitTest(
        drawing: TrendLineDrawing,
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

        const segment = {
            start,
            end,
        }

        if (LineGeometry.isNearHandle(mouse, start, HitTestConstants.HANDLE_RADIUS)) {
            return {
                drawing,
                target: HitTarget.StartHandle,
                cursor: CursorType.Move,
            }
        }

        if (LineGeometry.isNearHandle(mouse, end, HitTestConstants.HANDLE_RADIUS)) {
            return {
                drawing,
                target: HitTarget.EndHandle,
                cursor: CursorType.Move,
            }
        }

        if (LineGeometry.isNearBody(mouse, segment, tolerance)) {
            return {
                drawing,
                target: HitTarget.Body,
                cursor: CursorType.Move,
            }
        }

        return null
    }
}
