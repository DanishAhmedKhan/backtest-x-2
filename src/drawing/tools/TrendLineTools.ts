import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { Tool } from './Tool'
import { ToolType } from './ToolType'
import { TrendLineDrawing } from '../drawings/TrendLineDrawing'
import { PreviewDrawingManager } from '../PreviewDrawingManager'
import type { DrawingManager } from '../managers/DrawingManager'

export class TrendLineTool implements Tool {
    public readonly type = ToolType.TrendLine

    private preview: TrendLineDrawing | null = null

    constructor(
        private readonly drawingManager: DrawingManager,
        private readonly previewDrawingManager: PreviewDrawingManager,
    ) {}

    public activate() {}

    public deactivate() {
        this.cancel()
    }

    public handlePointerDown(event: ChartPointerEvent) {
        if (!this.preview) {
            this.preview = new TrendLineDrawing(event.point, event.point)

            this.previewDrawingManager.set(this.preview)

            return
        }

        this.preview.end = event.point

        this.drawingManager.addDrawing(this.preview)

        this.previewDrawingManager.clear()

        this.preview = null
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
