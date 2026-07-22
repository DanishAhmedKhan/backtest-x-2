import { TrendLineDrawing } from '../drawings/TrendLineDrawing'
import type { DrawingManager } from '../managers/DrawingManager'
import type { ChartPoint } from '../models/ChartPoint'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { Tool } from '../tools/Tool'
import { ToolType } from '../tools/ToolType'

export class TrendLineTool implements Tool {
    public readonly type = ToolType.TrendLine

    private startPoint: ChartPoint | null = null

    constructor(private readonly drawingManager: DrawingManager) {}

    public activate(): void {}

    public deactivate(): void {
        this.startPoint = null
    }

    public handlePointerDown(event: ChartPointerEvent): void {
        if (!this.startPoint) {
            this.startPoint = event.point

            console.log('Trend line start', event.point)

            return
        }

        const drawing = new TrendLineDrawing(crypto.randomUUID(), this.startPoint, event.point)

        this.drawingManager.addDrawing(drawing)

        console.log('Trend line finished', drawing)

        this.startPoint = null
    }

    public handlePointerMove(_event: ChartPointerEvent): void {}

    public handlePointerUp(_event: ChartPointerEvent): void {}

    public handlePointerLeave(): void {}

    public cancel(): void {
        this.startPoint = null
    }
}
