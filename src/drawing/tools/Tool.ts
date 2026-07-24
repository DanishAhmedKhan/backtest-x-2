import { ToolType } from './ToolType'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'

export interface Tool {
    readonly type: ToolType

    readonly allowsViewportInteraction: boolean

    activate(): void

    deactivate(): void

    handlePointerDown(event: ChartPointerEvent): void

    handlePointerMove(event: ChartPointerEvent): void

    handlePointerUp(event: ChartPointerEvent): void

    handlePointerLeave(): void

    cancel(): void
}
