import type { LongPositionDrawing } from '../drawings/LongPositionDrawing'

import type { DrawingHitTester } from './DrawingHitTester'
import { HitTarget } from './HitTarget'

import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../drawings/DrawingType'
import type { DrawingAnchor } from '../models/DrawingAnchor'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'

import { CursorType } from '../../core/cursor/CursorType'
import { RectangleGeometry } from '../geometry/RectangleGeometry'

export enum LongPositionHandle {
    Start = 'start',
    End = 'end',
    Target = 'target',
    Stoploss = 'stoploss',
}

export class LongPositionHitTester implements DrawingHitTester<LongPositionDrawing, LongPositionHandle> {
    public canHitTest(drawing: Drawing): drawing is LongPositionDrawing {
        return drawing.type === DrawingType.LongPosition
    }

    public hitTest(
        drawing: LongPositionDrawing,
        point: DrawingAnchor,
        transformer: CoordinateTransformer,
        tolerance: number,
    ) {
        const start = transformer.toPoint(drawing.start)
        const end = transformer.toPoint(drawing.end)
        const target = transformer.toPoint(drawing.target)
        const stoploss = transformer.toPoint(drawing.stoploss)
        const mouse = transformer.toPoint(point)

        if (!start || !end || !target || !stoploss || !mouse) return

        const handles = [
            {
                handle: LongPositionHandle.Start,
                point: start,
                cursor: CursorType.Move,
            },
            {
                handle: LongPositionHandle.End,
                point: end,
                cursor: CursorType.EW,
            },
            {
                handle: LongPositionHandle.Target,
                point: target,
                cursor: CursorType.NS,
            },
            {
                handle: LongPositionHandle.Stoploss,
                point: stoploss,
                cursor: CursorType.NS,
            },
        ]

        for (const handle of handles) {
            if (Math.abs(mouse.x - handle.point.x) <= tolerance && Math.abs(mouse.y - handle.point.y) <= tolerance) {
                return {
                    drawing,
                    target: HitTarget.Handle,
                    handle: handle.handle,
                    cursor: handle.cursor,
                }
            }
        }

        const left = Math.min(start.x, end.x)
        const right = Math.max(start.x, end.x)
        const targetY = Math.min(target.y, stoploss.y)
        const stoplossY = Math.max(target.y, stoploss.y)

        const bodyStart = {
            x: left,
            y: targetY,
        }

        const bodyEnd = {
            x: right,
            y: stoplossY,
        }

        if (RectangleGeometry.contains(mouse, bodyStart, bodyEnd)) {
            return {
                drawing,
                target: HitTarget.Body,
                handle: null,
                cursor: CursorType.Move,
            }
        }

        return null
    }
}
