import { FibRetracementDrawing } from '../drawings/FibRetracementDrawing'

import type { DrawingHitTester } from './DrawingHitTester'
import { HitTarget } from './HitTarget'
import { HitTestConstants } from './HitTestConstant'

import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../drawings/DrawingType'
import type { DrawingAnchor } from '../models/DrawingAnchor'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'

import { CursorType } from '../../core/cursor/CursorType'
import { LineGeometry } from '../geometry/LineGeometry'

export enum FibRetracementHandle {
    Start = 'start',
    End = 'end',
}

export class FibRetracementHitTester implements DrawingHitTester<FibRetracementDrawing, FibRetracementHandle> {
    public canHitTest(drawing: Drawing): drawing is FibRetracementDrawing {
        return drawing.type === DrawingType.FibRetracement
    }

    public hitTest(
        drawing: FibRetracementDrawing,
        point: DrawingAnchor,
        transformer: CoordinateTransformer,
        tolerance: number,
    ) {
        const start = transformer.toPoint(drawing.start)
        const end = transformer.toPoint(drawing.end)
        const mouse = transformer.toPoint(point)

        if (!start || !end || !mouse) return

        if (LineGeometry.isNearHandle(mouse, start, HitTestConstants.HANDLE_RADIUS)) {
            return {
                drawing,
                target: HitTarget.Handle,
                handle: FibRetracementHandle.Start,
                cursor: CursorType.Default,
            }
        }

        if (LineGeometry.isNearHandle(mouse, end, HitTestConstants.HANDLE_RADIUS)) {
            return {
                drawing,
                target: HitTarget.Handle,
                handle: FibRetracementHandle.End,
                cursor: CursorType.Default,
            }
        }

        for (const level of FibRetracementDrawing.LEVELS) {
            const price = drawing.getPriceAtLevel(level)

            const levelStart = transformer.toPoint({
                time: drawing.start.time,
                price,
            })

            const levelEnd = transformer.toPoint({
                time: drawing.end.time,
                price,
            })

            if (!levelStart || !levelEnd) continue

            const segment = {
                start: levelStart,
                end: levelEnd,
            }

            if (LineGeometry.isNearBody(mouse, segment, tolerance)) {
                return {
                    drawing,
                    target: HitTarget.Body,
                    handle: null,
                    cursor: CursorType.Pointer,
                }
            }
        }

        return null
    }
}
