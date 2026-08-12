import type { RectangleDrawing } from '../drawings/RectangleDrawing'

import type { DrawingHitTester } from './DrawingHitTester'
import { HitTarget } from './HitTarget'
import { HitTestConstants } from './HitTestConstant'

import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../drawings/DrawingType'
import type { DrawingAnchor } from '../models/DrawingAnchor'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'

import { CursorType } from '../../core/cursor/CursorType'

export enum RectangleHandle {
    TopLeft = 'top-left',
    Top = 'top',
    TopRight = 'top-right',
    Right = 'right',
    BottomRight = 'bottom-right',
    Bottom = 'bottom',
    BottomLeft = 'bottom-left',
    Left = 'left',
}

export class RectangleHitTester implements DrawingHitTester<RectangleDrawing, RectangleHandle> {
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

        const handles: {
            handle: RectangleHandle
            x: number
            y: number
            cursor: CursorType
        }[] = [
            {
                handle: RectangleHandle.TopLeft,
                x: left,
                y: top,
                cursor: CursorType.NWSE,
            },
            {
                handle: RectangleHandle.Top,
                x: centerX,
                y: top,
                cursor: CursorType.NS,
            },
            {
                handle: RectangleHandle.TopRight,
                x: right,
                y: top,
                cursor: CursorType.NESW,
            },
            {
                handle: RectangleHandle.Right,
                x: right,
                y: centerY,
                cursor: CursorType.EW,
            },
            {
                handle: RectangleHandle.BottomRight,
                x: right,
                y: bottom,
                cursor: CursorType.NWSE,
            },
            {
                handle: RectangleHandle.Bottom,
                x: centerX,
                y: bottom,
                cursor: CursorType.NS,
            },
            {
                handle: RectangleHandle.BottomLeft,
                x: left,
                y: bottom,
                cursor: CursorType.NESW,
            },
            {
                handle: RectangleHandle.Left,
                x: left,
                y: centerY,
                cursor: CursorType.EW,
            },
        ]

        for (const handle of handles) {
            if (Math.abs(mouse.x - handle.x) <= tolerance && Math.abs(mouse.y - handle.y) <= tolerance) {
                return {
                    drawing,
                    target: HitTarget.Handle,
                    handle: handle.handle,
                    cursor: handle.cursor,
                }
            }
        }

        if (mouse.x >= left && mouse.x <= right && mouse.y >= top && mouse.y <= bottom) {
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

// thanks the handle is working fine. i want to make a change the hit test for the rectangle should be only around the boundary of the rectangle and no inside the interior. so the selection and hover should only work on the border and not from inside the rectangle. this is how tradingview rectabgle works.
