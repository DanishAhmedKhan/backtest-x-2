import type { HorizontalLineDrawing } from '../drawings/HorizontalLineDrawing'

import type { DrawingHitTester } from './DrawingHitTester'
import { HitTarget } from './HitTarget'

import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../drawings/DrawingType'
import type { DrawingAnchor } from '../models/DrawingAnchor'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'

import { CursorType } from '../../core/cursor/CursorType'

export class HorizontalLineHitTester implements DrawingHitTester<HorizontalLineDrawing> {
    public canHitTest(drawing: Drawing): drawing is HorizontalLineDrawing {
        return drawing.type === DrawingType.HorizontalLine
    }

    public hitTest(
        drawing: HorizontalLineDrawing,
        point: DrawingAnchor,
        transformer: CoordinateTransformer,
        tolerance: number,
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
                handle: null,
                cursor: CursorType.Pointer,
            }
        }

        return null
    }
}
