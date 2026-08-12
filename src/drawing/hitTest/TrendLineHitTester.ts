import { TrendLineDrawing } from '../drawings/TrendLineDrawing'

import type { DrawingHitTester } from './DrawingHitTester'
import { HitTarget } from './HitTarget'
import { HitTestConstants } from './HitTestConstant'

import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../drawings/DrawingType'
import type { DrawingAnchor } from '../models/DrawingAnchor'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'

import { CursorType } from '../../core/cursor/CursorType'
import { LineGeometry } from '../geometry/LineGeometry'

export enum TrendLineHandle {
    Start = 'start',
    End = 'end',
}

export class TrendLineHitTester implements DrawingHitTester<TrendLineDrawing, TrendLineHandle> {
    public canHitTest(drawing: Drawing): drawing is TrendLineDrawing {
        return drawing.type === DrawingType.TrendLine
    }

    public hitTest(
        drawing: TrendLineDrawing,
        point: DrawingAnchor,
        transformer: CoordinateTransformer,
        tolerance: number,
    ) {
        const start = transformer.toPoint(drawing.start)
        const end = transformer.toPoint(drawing.end)
        const mouse = transformer.toPoint(point)

        if (!start || !end || !mouse) {
            return null
        }

        if (LineGeometry.isNearHandle(mouse, start, HitTestConstants.HANDLE_RADIUS)) {
            return {
                drawing,
                target: HitTarget.Handle,
                handle: TrendLineHandle.Start,
                cursor: CursorType.Default,
            }
        }

        if (LineGeometry.isNearHandle(mouse, end, HitTestConstants.HANDLE_RADIUS)) {
            return {
                drawing,
                target: HitTarget.Handle,
                handle: TrendLineHandle.End,
                cursor: CursorType.Default,
            }
        }

        const segment = {
            start,
            end,
        }

        if (LineGeometry.isNearBody(mouse, segment, tolerance)) {
            return {
                drawing,
                target: HitTarget.Body,
                handle: null,
                cursor: CursorType.Pointer,
            }
        }

        return null
    }
}
