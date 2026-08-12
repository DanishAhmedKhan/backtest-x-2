import type { RectangleDrawing } from '../drawings/RectangleDrawing'

import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../drawings/DrawingType'
import type { DrawingManager } from '../managers/DrawingManager'
import type { DrawingAction } from './DrawingAction'
import type { DrawingActionProvider } from './DrawingActionProvider'
import type { DrawingStateManager } from '../managers/DrawingStateManager'
import type { RenderInvalidator } from '../renderer/RenderInvalidator'

import { StrokeActions } from './StrokeActions'
import { CommonDrawingActions } from './CommonDrawingActions'

export class RectangleActionProvider implements DrawingActionProvider<RectangleDrawing> {
    constructor(
        private readonly drawingManager: DrawingManager,
        private readonly drawingStateManager: DrawingStateManager,
        private readonly renderInvalidator: RenderInvalidator,
    ) {}

    public canProvideActions(drawing: Drawing): drawing is RectangleDrawing {
        return drawing.type === DrawingType.Rectangle
    }

    public getActions(drawing: RectangleDrawing): DrawingAction[] {
        return [
            ...StrokeActions.getActions(drawing, this.drawingStateManager, this.renderInvalidator),

            {
                id: 'background',
                label: 'Background Color',
                value: drawing.backgropund,
                execute: (backgroundColor) => {
                    drawing.backgropund = backgroundColor

                    this.drawingStateManager.refresh()
                    this.renderInvalidator.invalidate()
                },
            },

            {
                id: 'settings',
                label: 'Settings',
                execute: () => {
                    console.log('Open Rectangle Settings')
                },
            },

            ...CommonDrawingActions.getActions(
                drawing,
                this.drawingManager,
                this.drawingStateManager,
                this.renderInvalidator,
            ),
        ]
    }
}
