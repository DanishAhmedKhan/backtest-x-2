import { VerticalLineDrawing } from '../drawings/VerticalLineDrawing'

import type { Drawing } from '../drawings/Drawing'
import type { DrawingManager } from '../managers/DrawingManager'
import type { DrawingAction } from './DrawingAction'
import type { DrawingActionProvider } from './DrawingActionProvider'
import type { DrawingStateManager } from '../managers/DrawingStateManager'
import type { RenderInvalidator } from '../renderer/RenderInvalidator'

import { CommonDrawingActions } from './CommonDrawingActions'
import { StrokeActions } from './StrokeActions'

export class VerticalLineActionProvider implements DrawingActionProvider<VerticalLineDrawing> {
    constructor(
        private readonly drawingManager: DrawingManager,
        private readonly drawingStateManager: DrawingStateManager,
        private readonly renderInvalidator: RenderInvalidator,
    ) {}

    public canProvideActions(drawing: Drawing): drawing is VerticalLineDrawing {
        return drawing instanceof VerticalLineDrawing
    }

    public getActions(drawing: VerticalLineDrawing): DrawingAction[] {
        return [
            ...StrokeActions.getActions(drawing, this.drawingStateManager, this.renderInvalidator),

            ...CommonDrawingActions.getActions(
                drawing,
                this.drawingManager,
                this.drawingStateManager,
                this.renderInvalidator,
            ),

            {
                id: 'settings',
                label: 'Settings',
                execute: () => {
                    console.log('Open Vertical Line Settings')
                },
            },
        ]
    }
}
