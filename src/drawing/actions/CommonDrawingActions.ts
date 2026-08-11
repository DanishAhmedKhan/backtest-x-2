import type { Drawing } from '../drawings/Drawing'
import type { DrawingManager } from '../managers/DrawingManager'
import type { DrawingStateManager } from '../managers/DrawingStateManager'
import type { DrawingAction } from './DrawingAction'
import type { RenderInvalidator } from '../renderer/RenderInvalidator'

export class CommonDrawingActions {
    public static getActions(
        drawing: Drawing,
        drawingManager: DrawingManager,
        drawingStateManager: DrawingStateManager,
        renderInvalidator: RenderInvalidator,
    ): DrawingAction[] {
        return [
            {
                id: 'delete',
                label: 'Delete',
                execute: () => {
                    drawingManager.removeDrawing(drawing.id)

                    drawingStateManager.clearSelection()
                    renderInvalidator.invalidate()
                },
            },
        ]
    }
}
