import { DrawingStateManager } from '../managers/DrawingStateManager'
import { HitTestManager } from '../hitTest/HitTestManager'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'

export class HoverController {
    constructor(
        private readonly drawingStateManager: DrawingStateManager,
        private readonly hitTestManager: HitTestManager,
        private readonly transformer: CoordinateTransformer,
    ) {}

    public handlePointerMove(event: ChartPointerEvent) {
        const result = this.hitTestManager.hitTest(event.point, this.transformer)

        this.drawingStateManager.setHovered(result?.drawing ?? null)
    }

    public handlePointerLeave() {
        this.drawingStateManager.setHovered(null)
    }
}
