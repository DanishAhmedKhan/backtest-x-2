import type { RectangleDrawing } from '../drawings/RectangleDrawing'

import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../drawings/DrawingType'
import type { DrawingManager } from '../managers/DrawingManager'
import type { DrawingAction } from './DrawingAction'
import type { DrawingActionProvider } from './DrawingActionProvider'
import type { DrawingStateManager } from '../managers/DrawingStateManager'
import type { RenderInvalidator } from '../renderer/RenderInvalidator'

import type { DrawingActionFactory } from './DrawinActionFactory'
import { StrokeActions } from './StrokeActions'
import { CommonDrawingActions } from './CommonDrawingActions'

export class RectangleActionProvider implements DrawingActionProvider<RectangleDrawing> {
    constructor(
        private readonly drawingManager: DrawingManager,
        private readonly drawingStateManager: DrawingStateManager,
        private readonly renderInvalidator: RenderInvalidator,
        private readonly actionFactory: DrawingActionFactory,
    ) {}

    public canProvideActions(drawing: Drawing): drawing is RectangleDrawing {
        return drawing.type === DrawingType.Rectangle
    }

    public getActions(drawing: RectangleDrawing): DrawingAction[] {
        return [
            StrokeActions.color(drawing, this.actionFactory),

            {
                id: 'background',
                label: 'Background Color',
                value: drawing.background,
                execute: (backgroundColor) => {
                    drawing.background = backgroundColor

                    this.drawingStateManager.refresh()
                    this.renderInvalidator.invalidate()
                },
            },

            StrokeActions.width(drawing, this.actionFactory),
            StrokeActions.style(drawing, this.actionFactory),

            ...CommonDrawingActions.getActions(drawing, this.drawingManager, this.actionFactory),
        ]
    }
}
