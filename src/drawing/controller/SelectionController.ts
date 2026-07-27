import { DrawingStateManager } from '../managers/DrawingStateManager'
import { HitTestManager } from '../hitTest/HitTestManager'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'

export class SelectionController {
    constructor(
        private readonly drawingStateManager: DrawingStateManager,
        private readonly hitTestManager: HitTestManager,
        private readonly transformer: CoordinateTransformer,
    ) {}

    public handlePointerDown(event: ChartPointerEvent): boolean {
        const result = this.hitTestManager.hitTest(event.point, this.transformer)

        if (!result) {
            this.drawingStateManager.clearSelection()

            return false
        }

        if (this.drawingStateManager.isSelected(result.drawing)) {
            return true
        }

        this.drawingStateManager.setSelected(result.drawing)

        return false
    }
}
