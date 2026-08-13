import type { LongPositionDrawing } from '../drawings/LongPositionDrawing'

import type { DrawingHitTester } from './DrawingHitTester'
import { HitTarget } from './HitTarget'

import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../drawings/DrawingType'
import type { DrawingAnchor } from '../models/DrawingAnchor'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'

import { CursorType } from '../../core/cursor/CursorType'

export enum LongShortPositionHandle {
    Entry = 'entry',
    Target = 'target',
    Stop = 'stop',
}

export enum LongPositionHandle {
    Start = 'start',
    End = 'end',
    Top = 'top',
    Bottom = 'bottom',
}

export class LongPositionHitTester implements DrawingHitTester<LongPositionDrawing, LongPositionHandle> {
    public canHitTest(drawing: Drawing): drawing is LongPositionDrawing {
        return drawing.type === DrawingType.LongPosition
    }

    public hitTest(drawing: LongPositionDrawing, point: DrawingAnchor, transformer: CoordinateTransformer, tolerance) {
        const start = transformer.toPoint(drawing.start)
        const end = transformer.toPoint(drawing.end)
        const top = transformer.toPoint(drawing.top)
        const bottom = transformer.toPoint(drawing.bottom)
        const mouse = transformer.toPoint(point)

        if (!start || !end || !top || !bottom || !mouse) {
            return null
        }

        const handles = [
            {
                handle: LongPositionHandle.Start,
                point: start,
                cursor: CursorType.Move,
                type: 'circle' as const,
            },
            {
                handle: LongPositionHandle.End,
                point: end,
                cursor: CursorType.EW,
                type: 'square' as const,
            },
            {
                handle: LongPositionHandle.Top,
                point: top,
                cursor: CursorType.NS,
                type: 'square' as const,
            },
            {
                handle: LongPositionHandle.Bottom,
                point: bottom,
                cursor: CursorType.NS,
                type: 'square' as const,
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
        const topY = Math.min(top.y, bottom.y)
        const bottomY = Math.max(top.y, bottom.y)

        const entryY = start.y

        const nearTop = mouse.x >= left && mouse.x <= right && Math.abs(mouse.y - topY) <= tolerance

        const nearBottom = mouse.x >= left && mouse.x <= right && Math.abs(mouse.y - bottomY) <= tolerance

        const nearEntry = mouse.x >= left && mouse.x <= right && Math.abs(mouse.y - entryY) <= tolerance

        const nearLeft = mouse.y >= topY && mouse.y <= bottomY && Math.abs(mouse.x - left) <= tolerance

        const nearRight = mouse.y >= topY && mouse.y <= bottomY && Math.abs(mouse.x - right) <= tolerance

        if (nearTop || nearBottom || nearEntry || nearLeft || nearRight) {
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
