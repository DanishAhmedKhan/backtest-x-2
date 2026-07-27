import type { DrawingManager } from '../managers/DrawingManager'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'
import type { ChartPoint } from '../models/ChartPoint'

import type { DrawingHitTester } from './DrawingHitTester'
import type { HitTestResult } from './HitTestResult'

export class HitTestManager {
    private readonly hitTesters: DrawingHitTester[] = []

    constructor(private readonly drawingManager: DrawingManager) {}

    public register(hitTester: DrawingHitTester) {
        this.hitTesters.push(hitTester)
    }

    public hitTest(point: ChartPoint, transformer: CoordinateTransformer, tolerance = 5): HitTestResult | null {
        const drawings = this.drawingManager.getDrawings()

        for (let i = drawings.length - 1; i >= 0; i--) {
            const drawing = drawings[i]

            for (const tester of this.hitTesters) {
                if (!tester.canHitTest(drawing)) {
                    continue
                }

                const result = tester.hitTest(drawing, point, transformer, tolerance)

                if (result) {
                    return result
                }

                break
            }
        }

        return null
    }
}
