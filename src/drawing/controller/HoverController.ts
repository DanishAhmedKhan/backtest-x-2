import { DrawingStateManager } from '../managers/DrawingStateManager'
import { HitTestManager } from '../hitTest/HitTestManager'
import type { RenderInvalidator } from '../renderer/RenderInvalidator'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'
import { HitTestConstants } from '../hitTest/HitTestConstant'
import type { CursorController } from '../../core/cursor/CursorController'
import { CursorSource } from '../../core/cursor/CursorSource'

export class HoverController {
    constructor(
        private readonly drawingStateManager: DrawingStateManager,
        private readonly hitTestManager: HitTestManager,
        private readonly transformer: CoordinateTransformer,
        private readonly renderInvalidator: RenderInvalidator,
        private readonly cursorController: CursorController,
    ) {}

    public handlePointerMove(event: ChartPointerEvent) {
        const result = this.hitTestManager.hitTest(
            event.anchor,
            this.transformer,
            HitTestConstants.HOVER_LINE_TOLERANCE,
        )

        const hovered = result?.drawing ?? null

        if (hovered !== this.drawingStateManager.getHovered()) {
            this.drawingStateManager.setHovered(hovered)
            this.renderInvalidator.invalidate()
        }

        if (result) {
            this.cursorController.request(CursorSource.Hover, result.cursor)
        } else {
            this.cursorController.clear(CursorSource.Hover)
        }
    }

    public handlePointerLeave() {
        this.drawingStateManager.setHovered(null)

        this.cursorController.clear(CursorSource.Hover)
        this.renderInvalidator.invalidate()
    }
}
