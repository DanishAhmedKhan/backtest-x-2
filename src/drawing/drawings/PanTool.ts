import type { Tool } from '../tools/Tool'
import { ToolType } from '../tools/ToolType'
import type { DrawingManager } from '../managers/DrawingManager'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'

export class PanTool implements Tool {
    public readonly type = ToolType.Pan

    public readonly allowsViewportInteraction = true

    public readonly allowsSelection = true

    constructor(protected readonly drawingManager: DrawingManager) {}

    public activate(): void {
        console.log('PanTool activated')
    }

    public deactivate(): void {
        console.log('PanTool deactivated')
    }

    public handlePointerDown(event: ChartPointerEvent): void {
        // console.log('Pointer Down', event)
    }

    public handlePointerMove(event: ChartPointerEvent): void {
        // console.log('Pointer Move', event)
    }

    public handlePointerUp(event: ChartPointerEvent): void {
        // console.log('Pointer Up', event)
    }

    public handlePointerLeave(): void {}

    public cancel(): void {}
}
