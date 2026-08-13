import { LongPositionDrawing } from '../drawings/LongPositionDrawing'

import type { Tool } from './Tool'
import { ToolType } from './ToolType'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'

import type { DrawingManager } from '../managers/DrawingManager'
import type { DrawingStateManager } from '../managers/DrawingStateManager'
import type { PreviewDrawingManager } from '../renderer/PreviewDrawingManager'

import { eventBus } from '../../event/EventBus'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'

export class LongPositionTool implements Tool {
    public readonly type = ToolType.LongPosition
    public readonly allowsViewportInteraction = false
    public readonly allowsSelection = false

    private preview: LongPositionDrawing | null = null

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
            x: start.x + 100,
            y: start.y,
        }

        const top = {
            x: start.x,
            y: start.y - 100,
        }

        const bottom = {
            x: start.x,
            y: start.y + 100,
        }

        const startAnchor = { ...event.anchor }

        const endAnchor = this.transformer.toAnchor(end.x, end.y)
        const topAnchor = this.transformer.toAnchor(top.x, top.y)
        const bottomAnchor = this.transformer.toAnchor(bottom.x, bottom.y)

        if (!endAnchor || !topAnchor || !bottomAnchor) {
            return
        }

        this.preview = new LongPositionDrawing(crypto.randomUUID(), startAnchor, endAnchor, topAnchor, bottomAnchor)

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
