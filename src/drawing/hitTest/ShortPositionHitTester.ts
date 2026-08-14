import type { ShortPositionDrawing } from '../drawings/ShortPositionDrawing'

import type { DrawingHitTester } from './DrawingHitTester'
import { HitTarget } from './HitTarget'

import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../drawings/DrawingType'
import type { DrawingAnchor } from '../models/DrawingAnchor'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'

import { CursorType } from '../../core/cursor/CursorType'
import { RectangleGeometry } from '../geometry/RectangleGeometry'

export enum ShortPositionHandle {
    Start = 'start',
    End = 'end',
    Target = 'taget',
    Stoploss = 'stoploss',
}

export class ShortPositionHitTester implements DrawingHitTester<ShortPositionDrawing, ShortPositionHandle> {
    public canHitTest(drawing: Drawing): drawing is ShortPositionDrawing {
        return drawing.type === DrawingType.ShortPosition
    }

    public hitTest(
        drawing: ShortPositionDrawing,
        point: DrawingAnchor,
        transformer: CoordinateTransformer,
        tolerance: number,
    ) {
        const start = transformer.toPoint(drawing.start)
        const end = transformer.toPoint(drawing.end)
        const target = transformer.toPoint(drawing.target)
        const stoploss = transformer.toPoint(drawing.stoploss)
        const mouse = transformer.toPoint(point)

        if (!start || !end || !target || !stoploss || !mouse) {
            return null
        }

        const handles = [
            {
                handle: ShortPositionHandle.Start,
                point: start,
                cursor: CursorType.Move,
            },
            {
                handle: ShortPositionHandle.End,
                point: end,
                cursor: CursorType.EW,
            },
            {
                handle: ShortPositionHandle.Target,
                point: target,
                cursor: CursorType.NS,
            },
            {
                handle: ShortPositionHandle.Stoploss,
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
