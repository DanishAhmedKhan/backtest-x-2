import { DrawingStateManager } from '../managers/DrawingStateManager'
import { HitTestManager } from '../hitTest/HitTestManager'
import type { RenderInvalidator } from '../renderer/RenderInvalidator'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'
import { HitTestConstants } from '../hitTest/HitTestConstant'

export class HoverController {
    constructor(
        private readonly drawingStateManager: DrawingStateManager,
        private readonly hitTestManager: HitTestManager,
        private readonly transformer: CoordinateTransformer,
        private readonly renderInvalidator: RenderInvalidator,
    ) {}

    public handlePointerMove(event: ChartPointerEvent) {
        const result = this.hitTestManager.hitTest(event.point, this.transformer, HitTestConstants.HOVER_LINE_TOLERANCE)

        const hovered = result?.drawing ?? null

        if (hovered !== this.drawingStateManager.getHovered()) {
            this.drawingStateManager.setHovered(hovered)
            this.renderInvalidator.invalidate()
        }
    }

    public handlePointerLeave() {
        this.drawingStateManager.setHovered(null)
        this.renderInvalidator.invalidate()
    }
}
