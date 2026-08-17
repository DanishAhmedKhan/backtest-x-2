import { TrendLineDrawing } from '../drawings/TrendLineDrawing'
import { TrendLineSnapper } from '../geometry/TrebdLineSnapper'

import type { Tool } from './Tool'
import { ToolType } from './ToolType'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { DrawingManager } from '../managers/DrawingManager'
import type { PreviewDrawingManager } from '../renderer/PreviewDrawingManager'
import type { DrawingStateManager } from '../managers/DrawingStateManager'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'

import { eventBus } from '../../event/EventBus'

export class TrendLineTool implements Tool {
    public readonly type = ToolType.TrendLine

    public readonly allowsViewportInteraction = false

    public readonly allowsSelection = false

    public readonly createsDrawing = true

    private preview: TrendLineDrawing | null = null

    private readonly snapper: TrendLineSnapper

    constructor(
        private readonly drawingManager: DrawingManager,
        private readonly previewDrawingManager: PreviewDrawingManager,
        private readonly drawingStateManager: DrawingStateManager,
        transformer: CoordinateTransformer,
    ) {
        this.snapper = new TrendLineSnapper(transformer)
    }

    public activate() {}

    public deactivate() {
        this.cancel()
    }

    public handlePointerDown(event: ChartPointerEvent) {
        if (!this.preview) {
            this.preview = new TrendLineDrawing(crypto.randomUUID(), event.anchor, event.anchor)

            this.previewDrawingManager.set(this.preview)

            return
        }

        this.preview.end = this.snapper.snap(this.preview.start, event)

        this.drawingManager.addDrawing(this.preview)
        this.previewDrawingManager.clear()
        this.drawingStateManager.setSelected(this.preview)

        this.preview = null

        eventBus.emit('drawingCompleted')
    }

    public handlePointerMove(event: ChartPointerEvent) {
        if (!this.preview) {
            return
        }

        this.preview.end = this.snapper.snap(this.preview.start, event)

        this.previewDrawingManager.set(this.preview)
    }

    public handlePointerUp() {}

    public handlePointerLeave() {}

    public cancel() {
        this.preview = null
        this.previewDrawingManager.clear()
    }
}
