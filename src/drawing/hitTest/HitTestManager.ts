import type { DrawingManager } from '../managers/DrawingManager'
import type { DrawingStateManager } from '../managers/DrawingStateManager'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'
import type { DrawingAnchor } from '../models/DrawingAnchor'

import type { DrawingHitTester } from './DrawingHitTester'
import type { HitTestResult } from './HitTestResult'
import type { DrawingHitTestContext } from './DrawingHitTestContext'
import type { Drawing } from '../drawings/Drawing'

export class HitTestManager {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly hitTesters: DrawingHitTester<any, any>[] = []

    constructor(
        private readonly drawingManager: DrawingManager,
        private readonly drawingStateManager: DrawingStateManager,
    ) {}

    public register<TDrawing extends Drawing, THandle>(hitTester: DrawingHitTester<TDrawing, THandle>) {
        this.hitTesters.push(hitTester)
    }

    public hitTest(point: DrawingAnchor, transformer: CoordinateTransformer, tolerance = 5): HitTestResult | null {
        const drawings = this.drawingManager.getDrawings()

        const context: DrawingHitTestContext = {
            selected: this.drawingStateManager.getSelected(),
        }

        for (let i = drawings.length - 1; i >= 0; i--) {
            const drawing = drawings[i]

            for (const tester of this.hitTesters) {
                if (!tester.canHitTest(drawing)) {
                    continue
                }

                const result = tester.hitTest(drawing, point, transformer, tolerance, context)

                if (result) {
                    return result
                }

                break
            }
        }

        return null
    }
}
