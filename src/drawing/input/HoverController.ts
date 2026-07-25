import type { ChartPointerEvent } from '../models/ChartPointerEvents'

import { DrawingManager } from '../managers/DrawingManager'
import { DrawingStateManager } from '../managers/DrawingStateManager'

import { HitTestManager } from '../hitTest/HitTestManager'

import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'

export class HoverController {
    constructor(
        private readonly drawingManager: DrawingManager,
        private readonly drawingStateManager: DrawingStateManager,
        private readonly hitTestManager: HitTestManager,
        private readonly transformer: CoordinateTransformer,
    ) {}

    public handlePointerMove(event: ChartPointerEvent) {
        const result = this.hitTestManager.hitTest(this.drawingManager.getDrawings(), event.point, this.transformer)

        this.drawingStateManager.setHovered(result?.drawing ?? null)
    }

    public handlePointerLeave() {
        this.drawingStateManager.setHovered(null)
    }
}
