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
        tolerance = HitTestConstants.HANDLE_TOLERANCE,
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

        const centerX = (left + right) / 2
        const centerY = (top + bottom) / 2

        const handles = [
            {
                target: HitTarget.TopLeft,
                x: left,
                y: top,
                cursor: CursorType.NWSE,
            },
            {
                target: HitTarget.Top,
                x: centerX,
                y: top,
                cursor: CursorType.NS,
            },
            {
                target: HitTarget.TopRight,
                x: right,
                y: top,
                cursor: CursorType.NESW,
            },
            {
                target: HitTarget.Right,
                x: right,
                y: centerY,
                cursor: CursorType.EW,
            },
            {
                target: HitTarget.BottomRight,
                x: right,
                y: bottom,
                cursor: CursorType.NWSE,
            },
            {
                target: HitTarget.Bottom,
                x: centerX,
                y: bottom,
                cursor: CursorType.NS,
            },
            {
                target: HitTarget.BottomLeft,
                x: left,
                y: bottom,
                cursor: CursorType.NESW,
            },
            {
                target: HitTarget.Left,
                x: left,
                y: centerY,
                cursor: CursorType.EW,
            },
        ]

        for (const handle of handles) {
            if (Math.abs(mouse.x - handle.x) <= tolerance && Math.abs(mouse.y - handle.y) <= tolerance) {
                return {
                    drawing,
                    target: handle.target,
                    cursor: handle.cursor,
                }
            }
        }

        if (mouse.x >= left && mouse.x <= right && mouse.y >= top && mouse.y <= bottom) {
            return {
                drawing,
                target: HitTarget.Body,
                cursor: CursorType.Move,
            }
        }

        return null
    }
}

// thanks the handle is working fine. i want to make a change the hit test for the rectangle should be only around the boundary of the rectangle and no inside the interior. so the selection and hover should only work on the border and not from inside the rectangle. this is how tradingview rectabgle works.
