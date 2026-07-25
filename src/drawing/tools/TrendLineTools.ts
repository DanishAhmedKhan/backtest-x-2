import type { Tool } from './Tool'
import { ToolType } from './ToolType'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import { TrendLineDrawing } from '../drawings/TrendLineDrawing'
import { PreviewDrawingManager } from '../PreviewDrawingManager'
import type { DrawingManager } from '../managers/DrawingManager'
import type { DrawingStateManager } from '../managers/DrawingStateManager'
import { eventBus } from '../../event/EventBus'

export class TrendLineTool implements Tool {
    public readonly type = ToolType.TrendLine

    public readonly allowsViewportInteraction = false

    private preview: TrendLineDrawing | null = null

    constructor(
        private readonly drawingManager: DrawingManager,
        private readonly previewDrawingManager: PreviewDrawingManager,
        private readonly drawingStateManager: DrawingStateManager,
    ) {}

    public activate() {}

    public deactivate() {
        this.cancel()
    }

    public handlePointerDown(event: ChartPointerEvent) {
        if (!this.preview) {
            this.preview = new TrendLineDrawing(crypto.randomUUID(), event.point, event.point)

            this.previewDrawingManager.set(this.preview)

            return
        }

        this.preview.end = event.point

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

        this.preview.end = event.point

        this.previewDrawingManager.set(this.preview)
    }

    public handlePointerUp() {}

    public handlePointerLeave() {}

    public cancel() {
        this.preview = null

        this.previewDrawingManager.clear()
    }
}
