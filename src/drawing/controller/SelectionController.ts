import { DrawingStateManager } from '../managers/DrawingStateManager'
import { HitTestManager } from '../hitTest/HitTestManager'
import type { RenderInvalidator } from '../renderer/RenderInvalidator'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'
import { HitTestConstants } from '../hitTest/HitTestConstant'
import type { HitTestResult } from '../hitTest/HitTestResult'

export class SelectionController {
    constructor(
        private readonly drawingStateManager: DrawingStateManager,
        private readonly hitTestManager: HitTestManager,
        private readonly transformer: CoordinateTransformer,
        private readonly renderInvalidator: RenderInvalidator,
    ) {}

    public handlePointerDown(event: ChartPointerEvent): HitTestResult | null {
        const result = this.hitTestManager.hitTest(event.anchor, this.transformer, HitTestConstants.EDIT_LINE_TOLERANCE)

        if (!result) {
            this.drawingStateManager.clearSelection()
            this.renderInvalidator.invalidate()

            return null
        }

        this.drawingStateManager.setSelected(result.drawing)
        this.renderInvalidator.invalidate()

        return result
    }
}
