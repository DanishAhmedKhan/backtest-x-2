import { ShortPositionDrawing } from '../drawings/ShortPositionDrawing'

import type { Tool } from './Tool'
import { ToolType } from './ToolType'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'

import type { DrawingManager } from '../managers/DrawingManager'
import type { DrawingStateManager } from '../managers/DrawingStateManager'
import type { PreviewDrawingManager } from '../renderer/PreviewDrawingManager'

import { eventBus } from '../../event/EventBus'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'

export class ShortPositionTool implements Tool {
    public readonly type = ToolType.ShortPosition
    public readonly allowsViewportInteraction = false
    public readonly allowsSelection = false

    private preview: ShortPositionDrawing | null = null

    constructor(
        private readonly drawingManager: DrawingManager,
        private readonly previewDrawingManager: PreviewDrawingManager,
        private readonly drawingStateManager: DrawingStateManager,
        private readonly transformer: CoordinateTransformer,
    ) {}

    public activate() {}

    public deactivate() {
        this.cancel()
    }

    public handlePointerDown(event: ChartPointerEvent) {
        if (this.preview) return

        const start = this.transformer.toPoint(event.anchor)

        if (!start) return

        const end = {
            x: start.x + 150,
            y: start.y,
        }

        const target = {
            x: start.x,
            y: start.y + 150,
        }

        const stoploss = {
            x: start.x,
            y: start.y - 100,
        }

        const startAnchor = { ...event.anchor }

        const endAnchor = this.transformer.toAnchor(end.x, end.y)
        const targetAnchor = this.transformer.toAnchor(target.x, target.y)
        const stoplossAnchor = this.transformer.toAnchor(stoploss.x, stoploss.y)

        if (!endAnchor || !targetAnchor || !stoplossAnchor) {
            return
        }

        this.preview = new ShortPositionDrawing(
            crypto.randomUUID(),
            startAnchor,
            endAnchor,
            targetAnchor,
            stoplossAnchor,
        )

        this.drawingManager.addDrawing(this.preview)
        this.drawingStateManager.setSelected(this.preview)

        this.preview = null

        eventBus.emit('drawingCompleted')
    }

    public handlePointerMove(_event: ChartPointerEvent) {}

    public handlePointerUp() {}

    public handlePointerLeave() {}

    public cancel() {
        this.preview = null
        this.previewDrawingManager.clear()
    }
}
