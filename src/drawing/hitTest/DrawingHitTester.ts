import type { Drawing } from '../drawings/Drawing'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'
import type { ChartPoint } from '../models/ChartPoint'

import type { HitTestResult } from './HitTestResult'

export interface DrawingHitTester<T extends Drawing = Drawing> {
    canHitTest(drawing: Drawing): drawing is T

    hitTest(drawing: T, point: ChartPoint, transformer: CoordinateTransformer, tolerance?: number): HitTestResult | null
}
