import type { Tool } from '../tools/Tool'
import { ToolType } from '../tools/ToolType'
import type { DrawingManager } from '../managers/DrawingManager'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'

export class PanTool implements Tool {
    public readonly type = ToolType.Pan

    public readonly allowsViewportInteraction = true

    public readonly allowsSelection = true

    constructor(protected readonly drawingManager: DrawingManager) {}

    public activate(): void {}

    public deactivate(): void {}

    public handlePointerDown(_event: ChartPointerEvent): void {}

    public handlePointerMove(_event: ChartPointerEvent): void {}

    public handlePointerUp(_event: ChartPointerEvent): void {}

    public handlePointerLeave(): void {}

    public cancel(): void {}
}
