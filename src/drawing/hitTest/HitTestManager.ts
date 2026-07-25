import type { Drawing } from '../drawings/Drawing'
import type { ChartPoint } from '../models/ChartPoint'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'

import type { DrawingHitTester } from './DrawingHitTester'
import type { HitTestResult } from './HitTestResult'

export class HitTestManager {
    private readonly hitTesters: DrawingHitTester[] = []

    public register(hitTester: DrawingHitTester) {
        this.hitTesters.push(hitTester)
    }

    public hitTest(drawings: Drawing[], point: ChartPoint, transformer: CoordinateTransformer): HitTestResult | null {
        for (let i = drawings.length - 1; i >= 0; i--) {
            const drawing = drawings[i]

            for (const hitTester of this.hitTesters) {
                if (!hitTester.canHitTest(drawing)) {
                    continue
                }

                const result = hitTester.hitTest(drawing, point, transformer)

                if (result) {
                    return result
                }
            }
        }

        return null
    }
}
