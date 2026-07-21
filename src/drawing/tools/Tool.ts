import { ToolType } from './ToolType'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'

export interface Tool {
    readonly type: ToolType

    activate(): void

    deactivate(): void

    mouseDown(event: ChartPointerEvent): void

    mouseMove(event: ChartPointerEvent): void

    mouseUp(event: ChartPointerEvent): void

    mouseLeave(): void

    cancel(): void
}
