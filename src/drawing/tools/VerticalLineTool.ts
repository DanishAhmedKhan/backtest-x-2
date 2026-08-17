import { VerticalLineDrawing } from '../drawings/VerticalLineDrawing'

import type { Tool } from './Tool'
import { ToolType } from './ToolType'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'

import type { DrawingManager } from '../managers/DrawingManager'
import type { DrawingStateManager } from '../managers/DrawingStateManager'

import { eventBus } from '../../event/EventBus'

export class VerticalLineTool implements Tool {
    public readonly type = ToolType.VerticalLine
    public readonly allowsViewportInteraction = false
    public readonly allowsSelection = false
    public readonly createsDrawing = true

    constructor(
        private readonly drawingManager: DrawingManager,
        private readonly drawingStateManager: DrawingStateManager,
    ) {}

    public activate() {}

    public deactivate() {}

    public handlePointerDown(event: ChartPointerEvent) {
        const drawing = new VerticalLineDrawing(crypto.randomUUID(), { ...event.anchor })

        this.drawingManager.addDrawing(drawing)

        this.drawingStateManager.setSelected(drawing)

        eventBus.emit('drawingCompleted')
    }

    public handlePointerMove() {}

    public handlePointerUp() {}

    public handlePointerLeave() {}

    public cancel() {}
}
