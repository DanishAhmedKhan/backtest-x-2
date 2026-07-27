import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../DrawingType'
import { TrendLineDrawing } from '../drawings/TrendLineDrawing'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'
import type { DrawingHitTester } from './DrawingHitTester'
import { HitTarget } from './HitTestResult'
import type { ChartPoint } from '../models/ChartPoint'
import { Geometry } from '../geometry/Geometry'
import { HitTestConstants } from './HitTestConstant'

export class TrendLineHitTester implements DrawingHitTester<TrendLineDrawing> {
    public canHitTest(drawing: Drawing): drawing is TrendLineDrawing {
        return drawing.type === DrawingType.TrendLine
    }

    public hitTest(
        drawing: TrendLineDrawing,
        point: ChartPoint,
        transformer: CoordinateTransformer,
        tolerance = HitTestConstants.HOVER_LINE_TOLERANCE,
    ) {
        const start = transformer.toPoint(drawing.start.time, drawing.start.price)
        const end = transformer.toPoint(drawing.end.time, drawing.end.price)
        const mouse = transformer.toPoint(point.time, point.price)

        if (!start || !end || !mouse) {
            return null
        }

        if (Geometry.distance(mouse.x, mouse.y, start.x, start.y) <= HitTestConstants.HANDLE_RADIUS) {
            return {
                drawing,
                target: HitTarget.StartHandle,
            }
        }

        if (Geometry.distance(mouse.x, mouse.y, end.x, end.y) <= HitTestConstants.HANDLE_RADIUS) {
            return {
                drawing,
                target: HitTarget.EndHandle,
            }
        }

        if (Geometry.distanceToSegment(mouse.x, mouse.y, start.x, start.y, end.x, end.y) <= tolerance) {
            return {
                drawing,
                target: HitTarget.Body,
            }
        }

        return null
    }
}
