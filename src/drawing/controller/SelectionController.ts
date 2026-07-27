import type { ChartPointerEvent } from '../models/ChartPointerEvents'

import { DrawingManager } from '../managers/DrawingManager'
import { DrawingStateManager } from '../managers/DrawingStateManager'

import { HitTestManager } from '../hitTest/HitTestManager'

import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'

export class SelectionController {
    constructor(
        private readonly drawingManager: DrawingManager,
        private readonly drawingStateManager: DrawingStateManager,
        private readonly hitTestManager: HitTestManager,
        private readonly transformer: CoordinateTransformer,
    ) {}

    public handlePointerDown(event: ChartPointerEvent) {
        const result = this.hitTestManager.hitTest(this.drawingManager.getDrawings(), event.point, this.transformer)

        const selected = this.drawingStateManager.getSelected()

        if (selected !== (result?.drawing ?? null)) {
            this.drawingStateManager.setSelected(result?.drawing ?? null)
        }
    }
}
