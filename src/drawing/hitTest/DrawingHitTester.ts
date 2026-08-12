import type { Drawing } from '../drawings/Drawing'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'
import type { DrawingAnchor } from '../models/DrawingAnchor'

import type { HitTestResult } from './HitTestResult'

export interface DrawingHitTester<TDrawing extends Drawing = Drawing, THandle = null> {
    canHitTest(drawing: Drawing): drawing is TDrawing

    hitTest(
        drawing: TDrawing,
        point: DrawingAnchor,
        transformer: CoordinateTransformer,
        tolerance?: number,
    ): HitTestResult<THandle> | null
}
